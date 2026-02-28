const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // create funds
  const funds = [
    { name: 'Task Fund', code: 'TASK' },
    { name: 'Referral Fund', code: 'REF' },
    { name: 'Bonus Fund', code: 'BONUS' },
    { name: 'Withdraw Fund', code: 'WITHDRAW' }
  ]
  for (const f of funds) {
    await prisma.fund.upsert({ where: { code: f.code }, update: {}, create: f })
  }

  // create tasks according to spec
  const tasks = [
    { title: 'Join WhatsApp Group', description: 'Click the link and join our WhatsApp community', reward: 15000, fundCode: 'TASK', verification: 'manual', link: 'https://chat.whatsapp.com/Eg9ptnZNyZo2tg27E7BZrF?mode=gi_t' },
    { title: 'Share Link to 3 WhatsApp Groups', description: 'Share the Terezo Wallet link to at least 3 WhatsApp groups', reward: 15000, fundCode: 'TASK', verification: 'user-submitted' },
    { title: 'Follow on Telegram', description: 'Click and join our Telegram channel for updates', reward: 15000, fundCode: 'TASK', verification: 'manual', link: 'https://t.me/+f3CJ2pgPv0s0NmQ0' },
    { title: 'Final Claim Reward', description: 'Claim your final reward after completing first 3 tasks', reward: 30000, fundCode: 'TASK', verification: 'conditional' }
  ]
  for (const t of tasks) {
    await prisma.task.upsert({ where: { title: t.title }, update: {}, create: t })
  }

  // membership codes
  const codes = ['WELCOME50', 'GLS07032256']
  for (const code of codes) {
    await prisma.membershipCode.upsert({ where: { code }, update: {}, create: { code } })
  }

  // create an admin user if one doesn't exist
  const adminEmail = 'admin@example.com'
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        fullName: 'Administrator',
        firstName: 'Admin',
        isAdmin: true,
      },
    })
    console.log('Admin user created with email admin@example.com and password admin123')
  }

  // demo regular user for testing
  const demoEmail = 'user@example.com'
  const demoExists = await prisma.user.findUnique({ where: { email: demoEmail } })
  if (!demoExists) {
    const hashed2 = await bcrypt.hash('test123', 10)
    await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashed2,
        fullName: 'Demo User',
        firstName: 'Demo',
        balance: 50000,
        pendingBalance: 0,
        welcomeBonusClaimed: true,
      },
    })
    console.log('Demo user created with email user@example.com and password test123')
  }
  // add a couple of sample submissions for the demo user
  const demoUser = await prisma.user.findUnique({ where: { email: demoEmail } })
  if (demoUser) {
    const existingSubs = await prisma.taskSubmission.findMany({ where: { userId: demoUser.id } })
    if (existingSubs.length === 0) {
      const allTasks = await prisma.task.findMany()
      if (allTasks.length) {
        // create one approved submission to demonstrate
        await prisma.taskSubmission.create({
          data: {
            taskId: allTasks[0].id,
            userId: demoUser.id,
            proof: 'Seeded submission',
            status: 'approved',
            rewardPaid: true,
          },
        })
      }
    }
  }

  console.log('Seeding complete')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
