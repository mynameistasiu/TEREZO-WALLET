const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, referralCode } = req.body
    
    // Validate input (detailed)
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      errors.fullName = 'Full name is required'
    }
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Valid email is required'
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (phone && typeof phone === 'string' && phone.trim().length < 7) {
      errors.phone = 'Phone number seems invalid'
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors })
    }

    // Check if email already exists
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ errors: { email: 'Email already registered' } })

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Build user data (avoid schema-mismatch failures on older deployed DB schemas)
    const data = {
      email,
      password: hashed,
      fullName,
      phone,
      balance: 0, // Will be set to 64000 when welcome bonus is claimed
      pendingBalance: 0,
      welcomeBonusClaimed: false,
    }

    // Handle referral code
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } })
      if (referrer) {
        data.referredBy = referrer.id
      }
    }

    const user = await prisma.user.create({ data })

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    })
  } catch (err) {
    console.error('Auth register error:', err)
    // Prisma unique constraint
    if (err.code === 'P2002' && err.meta && err.meta.target) {
      const field = Array.isArray(err.meta.target) ? err.meta.target[0] : err.meta.target
      return res.status(400).json({ errors: { [field]: `${field} already in use` } })
    }
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'User not found' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ error: 'Invalid password' })

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        isAdmin: user.isAdmin || false,
        isMember: user.isMember,
        balance: user.balance,
        pendingBalance: user.pendingBalance,
        welcomeBonusClaimed: user.welcomeBonusClaimed,
      },
    })
  } catch (err) {
    console.error('Auth login error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// OTP Send endpoint (phase 2)
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body
    // Placeholder for OTP sending logic
    // find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    // generate simple 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: code, otpExpires: expires },
    })
    // in real app you would send SMS/Email here
    console.log(`Generated OTP for ${email}: ${code}`)
    res.json({ message: 'OTP sent (simulated)', code })
  } catch (err) {
    console.error('send-otp error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// OTP Verify endpoint (phase 2)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    // Placeholder for OTP verification logic
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({ error: 'Invalid code' })
    }
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Code expired' })
    }
    // clear otp and mark welcome bonus maybe
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpires: null },
    })
    res.json({ message: 'OTP verified' })
  } catch (err) {
    console.error('verify-otp error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

module.exports = router
