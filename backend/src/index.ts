// Main Express server entry point
import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config/env'
import uploadRoutes from './routes/upload'
import downloadRoutes from './routes/download'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

const app = express()

// Trust proxy headers when deployed behind a reverse proxy (e.g. AWS ALB / Nginx)
app.set('trust proxy', 1)

// Security headers
app.use(
  helmet({
    // We'll start with a CSP on the frontend; you can enable a stricter CSP
    // here later if you serve the frontend from this backend.
    contentSecurityPolicy: false,
  }),
)

// Additional security-related headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', "camera=(), microphone=(), geolocation=()")
  next()
})

// Lightweight global rate limiter for all API routes
// Very generous defaults to avoid impacting normal usage.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // up to 1000 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting to all /api routes (light protection against abuse)
app.use('/api', apiLimiter)

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}))

app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: true, limit: '100kb' }))

// Request logging (development only)
if (config.server.nodeEnv === 'development') {
  app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  })
})

// Per-route rate limiter for uploads (slightly stricter, but still generous)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // up to 60 uploads per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
})

// API routes
app.use('/api/upload', uploadLimiter, uploadRoutes)
app.use('/api/download', downloadRoutes)

// 404 handler
app.use(notFoundHandler)

// Error handler (must be last)
app.use(errorHandler)

// Start server
const PORT = config.server.port

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${config.server.nodeEnv}`)
  console.log(`📦 CORS enabled for: ${config.cors.origin}`)
})

export default app

