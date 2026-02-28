const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { auth, adminOnly } = require('./authMiddleware')
const prisma = new PrismaClient()
const router = express.Router()

// require authenticated admin for every route in this module
router.use(auth, adminOnly)

// list users (safe subset)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        firstName: true,
        isMember: true,
        isAdmin: true,
        balance: true,
        pendingBalance: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// membership codes listing & management
router.get('/membership-codes', async (req, res) => {
  try {
    const codes = await prisma.membershipCode.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(codes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/membership-codes', async (req, res) => {
  try {
    const { code, maxUses = 1, isActive = true } = req.body
    if (!code) return res.status(400).json({ error: 'Code is required' })
    const existing = await prisma.membershipCode.findUnique({ where: { code } })
    if (existing) return res.status(400).json({ error: 'Code already exists' })
    const newCode = await prisma.membershipCode.create({ data: { code, maxUses, isActive } })
    res.json(newCode)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/membership-codes/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params
    const code = await prisma.membershipCode.findUnique({ where: { id: parseInt(id) } })
    if (!code) return res.status(404).json({ error: 'Code not found' })
    const updated = await prisma.membershipCode.update({
      where: { id: parseInt(id) },
      data: { isActive: !code.isActive },
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// manual payments
router.get('/manual-payments', async (req, res) => {
  try {
    const payments = await prisma.manualPayment.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(payments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/manual-payments/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const payment = await prisma.manualPayment.update({
      where: { id: parseInt(id) },
      data: { status: 'approved' },
    })
    // also activate user membership
    await prisma.user.update({
      where: { id: payment.userId },
      data: { isMember: true },
    })
    res.json(payment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
router.post('/manual-payments/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const payment = await prisma.manualPayment.update({
      where: { id: parseInt(id) },
      data: { status: 'rejected' },
    })
    res.json(payment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// withdrawals
router.get('/withdrawals', async (req, res) => {
  try {
    const list = await prisma.withdrawal.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/withdrawals/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const w = await prisma.withdrawal.update({
      where: { id: parseInt(id) },
      data: { status: 'approved' },
    })
    // deduct amount from user balance
    await prisma.user.update({
      where: { id: w.userId },
      data: { balance: { decrement: w.amount } },
    })
    res.json(w)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
router.post('/withdrawals/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const w = await prisma.withdrawal.update({
      where: { id: parseInt(id) },
      data: { status: 'rejected' },
    })
    res.json(w)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// task submissions
router.get('/task-submissions', async (req, res) => {
  try {
    const subs = await prisma.taskSubmission.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(subs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
router.post('/task-submissions/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    // fetch submission with task reward
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: parseInt(id) },
      include: { task: true }
    })
    if (!submission) return res.status(404).json({ error: 'Submission not found' })

    const upd = await prisma.taskSubmission.update({
      where: { id: parseInt(id) },
      data: { status: 'approved', rewardPaid: true },
    })
    // credit user balance
    if (submission.task && submission.task.reward) {
      await prisma.user.update({
        where: { id: submission.userId },
        data: { balance: { increment: submission.task.reward } },
      })
    }
    res.json(upd)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
router.post('/task-submissions/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const upd = await prisma.taskSubmission.update({
      where: { id: parseInt(id) },
      data: { status: 'rejected' },
    })
    res.json(upd)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
