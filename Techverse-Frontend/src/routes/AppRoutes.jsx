import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Dashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/AdminProducts'

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  return user ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  return user && user.role === 'admin' ? children : <Navigate to="/" />
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
