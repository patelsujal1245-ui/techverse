import express from 'express'
import { getUsers, getUserById, updateUser } from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getUsers)
router.get('/:id', protect, admin, getUserById)
router.put('/:id', protect, admin, updateUser)

export default router
