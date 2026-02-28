const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { id: 'asc' },
    })
    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Submit task (user provides proof)
router.post('/:id/submit', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { userId, proof } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId required' })
    }

    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) return res.status(404).json({ error: 'Task not found' })

    // Check if user already submitted this task
    const existing = await prisma.taskSubmission.findFirst({
      where: { taskId: id, userId },
    })

    if (existing) {
      return res.status(400).json({ error: 'Task already submitted' })
    }

    // Create submission
    const submission = await prisma.taskSubmission.create({
      data: {
        taskId: id,
        userId,
        proof: proof || 'Task submitted',
        status: 'pending', // Awaiting admin approval
      },
    })

    res.json({
      message: 'Task submitted for verification',
      submission,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user's task submissions
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId)
    const submissions = await prisma.taskSubmission.findMany({
      where: { userId },
      include: { task: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(submissions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
