const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

// Get user dashboard data
router.get('/:userId/dashboard', async (req, res) => {
  try {
    const userId = Number(req.params.userId)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json({
      id: user.id,
      firstName: user.firstName || 'User',
      balance: user.balance,
      pendingBalance: user.pendingBalance,
      isMember: user.isMember,
      welcomeBonusClaimed: user.welcomeBonusClaimed,
      taskCount: user.tasks.length,
      recentTransactions: user.transactions,
    })
  } catch (err) {
    console.error('Claim welcome error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// Claim welcome bonus
router.post('/claim-welcome', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId required' })
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (user.welcomeBonusClaimed) {
      return res.status(400).json({ error: 'Bonus already claimed' })
    }

    // Add welcome bonus
    const updated = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        balance: user.balance + 64000,
        welcomeBonusClaimed: true,
      },
    })

    res.json({
      message: 'Welcome bonus claimed!',
      newBalance: updated.balance,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
