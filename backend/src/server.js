require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

const localOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
const allowedOrigins = [...new Set([...localOrigins, ...configuredOrigins])]
const hasExplicitCorsOrigins = configuredOrigins.length > 0

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests and mobile webviews without explicit origin.
      if (!origin) return callback(null, true)
      // If CORS_ORIGINS is not configured yet, do not block requests.
      if (!hasExplicitCorsOrigins) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
  })
)
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
app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
