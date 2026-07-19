import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import employeeRoutes from './routes/employees.js'
import organizationRoutes from './routes/organization.js'

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      /\.netlify\.app$/,        // any Netlify preview/deploy URL
      /\.netlify\.live$/,
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Playstack EMS API is running 🚀', version: '1.0.0' })
})

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/organization', organizationRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})
