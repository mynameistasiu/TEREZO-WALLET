const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

// Redeem membership code
router.post('/redeem', async (req, res) => {
  try {
    const { code, userId } = req.body

    const errors = {}
    if (!code || typeof code !== 'string' || code.trim().length === 0) errors.code = 'Activation code is required'
    if (!userId) errors.userId = 'userId is required'
    if (Object.keys(errors).length > 0) return res.status(400).json({ errors })

    const normalizedCode = code.trim()

    // Find membership code (case-insensitive)
    const membership = await prisma.membershipCode.findFirst({ where: { code: { equals: normalizedCode, mode: 'insensitive' } } })

    if (!membership || !membership.isActive) {
      return res.status(400).json({ errors: { code: 'Invalid activation code' } })
    }

    // Check if code has reached max uses
    if (membership.uses >= membership.maxUses) {
      return res.status(400).json({ errors: { code: 'Code has been used (limited use code)' } })
    }

    // Check if user already has membership
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.isMember) {
      return res.status(400).json({ errors: { user: 'User already has membership' } })
    }

    // Update user membership status and return updated user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { isMember: true },
    })

    // Increment code usage (use id to avoid case issues)
    await prisma.membershipCode.update({
      where: { id: membership.id },
      data: { uses: membership.uses + 1 },
    })

    res.json({
      message: 'Membership activated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        isMember: updatedUser.isMember,
        balance: updatedUser.balance,
        pendingBalance: updatedUser.pendingBalance,
        welcomeBonusClaimed: updatedUser.welcomeBonusClaimed,
      },
    })
  } catch (err) {
    console.error('Membership redeem error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// Manual payment endpoint
router.post('/manual-payment', async (req, res) => {
  try {
    const { userId, reference, amount } = req.body

    const errors = {}
    if (!userId) errors.userId = 'userId is required'
    if (!reference) errors.reference = 'reference is required'
    if (Object.keys(errors).length) return res.status(400).json({ errors })

    // Create manual payment record for admin verification
    const payment = await prisma.manualPayment.create({
      data: {
        userId: parseInt(userId),
        amount: parseInt(amount) || require('../config').MEMBERSHIP_FEE,
        reference,
        status: 'pending',
      },
    })

    res.json({
      message: 'Payment recorded. Awaiting admin verification.',
      paymentId: payment.id,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

module.exports = router
