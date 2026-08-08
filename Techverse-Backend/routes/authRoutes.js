import express from 'express'
import { registerUser, loginUser, getUserProfile, sendOTP, registerWithOTP, loginWithOTP } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/send-otp', sendOTP)
router.post('/register-with-otp', registerWithOTP)
router.post('/login-with-otp', loginWithOTP)
router.get('/profile', protect, getUserProfile)

export default router
