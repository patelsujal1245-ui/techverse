import api from './api'

export const fetchAdminStats = () => api.get('/admin/stats')
export const fetchWarehouseLogs = () => api.get('/admin/warehouse/logs')

