import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { login } from '../services/authService'
import { FiMail, FiLock } from 'react-icons/fi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login({ email, password })
      setUser(data)
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-page">
        <div className="auth-copy">
          <div>
            <span className="eyebrow">Welcome Back</span>
            <h1>Sign in to continue your orders and saved products.</h1>
            <p>
              Use the demo account if you want to move fast while presenting the project.
            </p>
          </div>
          <div className="auth-points">
            <div className="auth-point">
              <strong>Demo user</strong>
              <span className="muted">jane@techverse.com / Student123</span>
            </div>
            <div className="auth-point">
              <strong>Demo admin</strong>
              <span className="muted">admin@techverse.com / Admin123</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <h2>Login</h2>
          <p>Keep the same account to save cart, wishlist, and profile data.</p>
          <form onSubmit={submitHandler} className="auth-form">
            <label>
              Email
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--muted)' }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  style={{ paddingLeft: '40px' }}
                  required 
                />
              </div>
            </label>
            <label>
              Password
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </label>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <p className="small-copy" style={{ marginTop: 16, textAlign: 'center' }}>
              Don't have an account? <Link to="/register" style={{ fontWeight: 600, textDecoration: 'underline' }}>Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login
