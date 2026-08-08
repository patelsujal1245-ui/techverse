import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { cart, wishlist } = useContext(ShopContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearch(params.get('q') || '')
  }, [location.search])

  const submitSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <div className="brand-mark">TV</div>
        <div className="brand-info">
          <span className="brand-title">TechVerse</span>
          <span>Campus electronics</span>
        </div>
      </div>

      <form className="nav-search" onSubmit={submitSearch}>
        <FiSearch className="nav-search-icon" />
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </form>

      <div className="nav-links">
        <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>
          Shop
        </Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          About
        </Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
          Contact
        </Link>
        {user && user.role !== 'admin' ? (
          <Link to="/my-orders" className={location.pathname === '/my-orders' ? 'active' : ''}>
            My Orders
          </Link>
        ) : null}
        {user?.role === 'admin' ? (
          <Link
            to="/admin/dashboard"
            className={location.pathname.startsWith('/admin') ? 'active' : ''}
          >
            Admin
          </Link>
        ) : null}
      </div>

      <div className="nav-actions">
        <Link to="/wishlist" className={`icon-btn ${location.pathname === '/wishlist' ? 'active' : ''}`} title="Wishlist">
          <FiHeart />
          {wishlist.length > 0 ? <span className="badge">{wishlist.length}</span> : null}
        </Link>
        <Link to="/cart" className={`icon-btn ${location.pathname === '/cart' ? 'active' : ''}`} title="Cart">
          <FiShoppingCart />
          {cart.length > 0 ? <span className="badge">{cart.length}</span> : null}
        </Link>
        {user ? (
          <>
            <Link to="/profile" className={`icon-btn ${location.pathname === '/profile' ? 'active' : ''}`} title="Profile">
              <FiUser />
            </Link>
            <button type="button" className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-links a ${location.pathname === '/login' ? 'active' : ''}`} style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              Login
            </Link>
            <Link to="/register" className="logout-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

