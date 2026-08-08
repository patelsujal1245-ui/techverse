import api from './api'

export const createOrder = (orderData) => api.post('/orders', orderData)
export const fetchMyOrders = () => api.get('/orders/my-orders')
export const fetchOrders = () => api.get('/orders')
export const updateOrderStatusAPI = (orderId, updateData) => api.put(`/orders/${orderId}/status`, updateData)
export const cancelOrderAPI = (orderId) => api.put(`/orders/${orderId}/cancel`)

