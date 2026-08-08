import api from './api'

export const register = (userData) => api.post('/auth/register', userData)
export const login = (userData) => api.post('/auth/login', userData)
export const getProfile = () => api.get('/auth/profile')
export const sendOTP = (email) => api.post('/auth/send-otp', { email })
export const loginWithOTP = (otpData) => api.post('/auth/login-with-otp', otpData)
export const registerWithOTP = (otpData) => api.post('/auth/register-with-otp', otpData)
