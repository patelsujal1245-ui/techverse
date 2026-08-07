import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'

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
      <div className="nav-brand">
        <Link to="/" className="brand-mark">
          TV
        </Link>
        <div>
          <Link to="/" className="brand-title">
            TechVerse
          </Link>
          <span>Campus electronics</span>
        </div>
      </div>

      <form className="nav-search" onSubmit={submitSearch}>
        <input
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="nav-links">
        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        {user?.role === 'admin' ? <Link to="/admin/dashboard">Admin</Link> : null}
      </div>

      <div className="nav-actions">
        <Link to="/wishlist">Wishlist <span>{wishlist.length}</span></Link>
        <Link to="/cart">Cart <span>{cart.length}</span></Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
