const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

router.get('/funds', async (req, res) => {
  const funds = await prisma.fund.findMany()
  res.json(funds)
})

router.get('/:userId/history', async (req, res) => {
  const userId = Number(req.params.userId)
  const txs = await prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  res.json(txs)
})

module.exports = router
