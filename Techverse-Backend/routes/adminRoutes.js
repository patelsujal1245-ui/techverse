import express from 'express'
import { getAdminInfo, getAdminStats, getWarehouseLogs } from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getAdminInfo)
router.get('/stats', protect, admin, getAdminStats)
router.get('/warehouse/logs', protect, admin, getWarehouseLogs)

export default router
