import mongoose from 'mongoose'

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-deletes after 5 minutes (300 seconds)
})

const OTPModel = mongoose.model('OTP', otpSchema)
export default OTPModel
