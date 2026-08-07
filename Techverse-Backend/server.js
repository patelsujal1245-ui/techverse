import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { seedDefaultDataIfNeeded } from './seed/seedDefaultData.js'

dotenv.config()

const startServer = async () => {
  await connectDB()
  await seedDefaultDataIfNeeded()

  const app = express()
  app.use(express.json())
  app.use(cors())

  app.get('/', (req, res) => {
    res.json({ message: 'TechVerse API is running' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFound)
  app.use(errorHandler)

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error(`Server startup failed: ${error.message}`)
  process.exit(1)
})
