import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`).replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('techverseUser')
  if (userInfo && config.headers) {
    try {
      const { token } = JSON.parse(userInfo)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      localStorage.removeItem('techverseUser')
    }
  }
  return config
})

export default api
