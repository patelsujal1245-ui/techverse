import api from './api'

export const fetchProducts = (params) => api.get('/products', { params })
export const fetchProduct = (id) => api.get(`/products/${id}`)
export const fetchCategories = () => api.get('/categories')
export const createProduct = (productData) => api.post('/products', productData)
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
