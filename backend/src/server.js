require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/membership', require('./routes/membership'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/user', require('./routes/user'))
app.use('/api/withdraw', require('./routes/withdrawal'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/transactions', require('./routes/transactions'))

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', app: 'Terezo Wallet Backend' }))

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
