const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

// Request withdrawal
router.post('/', async (req, res) => {
  try {
    const { userId, bankName, accountName, accountNumber, amount, reason } = req.body
    const amountValue = parseInt(amount, 10)

    // Validate input
    if (!userId || !bankName || !accountName || !accountNumber || !amountValue) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get user
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Check membership
    if (!user.isMember) {
      return res.status(403).json({ error: 'Membership required to withdraw' })
    }

    // Check balance
    if (user.balance < amountValue) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Check minimum withdrawal
    if (amountValue < 1000) {
      return res.status(400).json({ error: 'Minimum withdrawal is N1,000' })
    }

    // Generate unique reference
    const reference = `WD-${Date.now()}-${userId}`

    // Create withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: parseInt(userId),
        amount: amountValue,
        bankName,
        accountName,
        accountNumber,
        reason: reason || '',
        reference,
        status: 'pending', // Admin must approve
      },
    })

    // Deduct from balance (can be reversed if rejected)
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { balance: user.balance - amountValue },
    })

    res.json({
      message: 'Withdrawal requested successfully',
      withdrawal,
      reference,
      newBalance: updatedUser.balance,
      isMember: updatedUser.isMember,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user withdrawals
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId)
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(withdrawals)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get single withdrawal
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
    })
    if (!withdrawal) return res.status(404).json({ error: 'Withdrawal not found' })
    res.json(withdrawal)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
