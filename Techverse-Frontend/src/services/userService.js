import api from './api'

export const fetchProfile = () => api.get('/auth/profile')
export const fetchUsers = () => api.get('/users')

