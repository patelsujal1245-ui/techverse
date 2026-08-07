import express from 'express'
import { getAdminInfo, getAdminStats } from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getAdminInfo)
router.get('/stats', protect, admin, getAdminStats)

export default router
