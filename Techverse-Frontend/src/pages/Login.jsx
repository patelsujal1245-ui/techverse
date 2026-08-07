import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { login } from '../services/authService'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      const { data } = await login({ email, password })
      setUser(data)
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <section className="page-shell auth-shell">
      <div className="auth-page">
        <div className="auth-copy">
          <div>
            <span className="eyebrow">Welcome back</span>
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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login
