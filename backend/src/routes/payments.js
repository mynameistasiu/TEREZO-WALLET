const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

// return details for manual payment
router.get('/manual/details', async (req, res) => {
  try {
    // return the same data defined in config (makes it easy to change later)
    const { MANUAL_PAYMENT_DETAILS } = require('../config')
    res.json(MANUAL_PAYMENT_DETAILS)
  } catch (err) {
    console.error('manual details error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// accept a manual payment submission
router.post('/manual', async (req, res) => {
  try {
    const { userId, amount, bankName, accountNumber, reference, receiptUrl } = req.body
    const errors = {}
    if (!userId) errors.userId = 'userId required'
    if (!reference) errors.reference = 'reference required'
    if (Object.keys(errors).length) return res.status(400).json({ errors })
    const payment = await prisma.manualPayment.create({
      data: {
        userId: parseInt(userId),
        amount: parseInt(amount) || require('../config').MEMBERSHIP_FEE,
        reference,
        status: 'pending',
        paymentProof: receiptUrl || null,
      },
    })

    res.json({ message: 'Payment recorded. Awaiting admin verification.', paymentId: payment.id })
  } catch (err) {
    console.error('manual payment error:', err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

module.exports = router
