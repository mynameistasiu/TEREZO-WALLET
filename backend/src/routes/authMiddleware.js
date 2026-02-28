const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function auth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Invalid authorization format' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'test-secret')
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user
    next()
  } catch (err) {
    console.error('Auth middleware error', err)
    res.status(401).json({ error: 'Invalid token' })
  }
}

function adminOnly(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

module.exports = { auth, adminOnly }
