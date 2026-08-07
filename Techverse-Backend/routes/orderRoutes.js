import express from 'express'
import { createOrder, getOrders, getMyOrders, getOrderById } from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createOrder).get(protect, admin, getOrders)
router.route('/my-orders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)

export default router
