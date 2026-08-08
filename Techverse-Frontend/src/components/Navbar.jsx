import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { cart, wishlist } = useContext(ShopContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearch(params.get('q') || '')
  }, [location.search])

  useEffect(() => {
    setIsDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-menu-container')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const submitSearch = (event) => {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
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

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
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
      </div>

      <div className="nav-actions">
        <Link to="/wishlist" className={`icon-btn ${location.pathname === '/wishlist' ? 'active' : ''}`} title="Wishlist" onClick={() => setIsMenuOpen(false)}>
          <FiHeart />
          {wishlist.length > 0 ? <span className="badge">{wishlist.length}</span> : null}
        </Link>
        <Link to="/cart" className={`icon-btn ${location.pathname === '/cart' ? 'active' : ''}`} title="Cart" onClick={() => setIsMenuOpen(false)}>
          <FiShoppingCart />
          {cart.length > 0 ? <span className="badge">{cart.length}</span> : null}
        </Link>
        {user ? (
          <div className="profile-menu-container">
            <button 
              type="button" 
              className={`icon-btn ${location.pathname === '/profile' || isDropdownOpen ? 'active' : ''}`} 
              title="Profile" 
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen)
                setIsMenuOpen(false)
              }}
            >
              <FiUser />
            </button>
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <hr className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item">
                  View Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="dropdown-item">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  type="button" 
                  className="dropdown-item logout-action-btn" 
                  onClick={() => { 
                    logout()
                    setIsDropdownOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-link-btn" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="register-btn" onClick={() => setIsMenuOpen(false)}>
              Register
            </Link>
          </>
        )}

        <button 
          type="button" 
          className="menu-toggle-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar

