import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import { seedDefaultData } from './seedUtils.js'

dotenv.config()

const run = async () => {
  await connectDB()
  await seedDefaultData()
  console.log('Sample data imported!')
  process.exit()
}

run().catch((error) => {
  console.error(`Error importing data: ${error.message}`)
  process.exit(1)
})

