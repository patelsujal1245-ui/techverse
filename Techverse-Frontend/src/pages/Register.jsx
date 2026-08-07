import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { register } from '../services/authService'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      const { data } = await register({ name, email, password, phone, address })
      setUser(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <section className="page-shell auth-shell">
      <div className="auth-page">
        <div className="auth-copy">
          <div>
            <span className="eyebrow">Create account</span>
            <h1>Make a profile for orders, wishlist, and checkout.</h1>
            <p>
              The form is kept direct and practical so the checkout flow stays fast and easy to use.
            </p>
          </div>
          <div className="auth-points">
            <div className="auth-point">
              <strong>What gets saved</strong>
              <span className="muted">Name, email, phone, and address</span>
            </div>
            <div className="auth-point">
              <strong>Role</strong>
              <span className="muted">Normal users get shopping access. Admin manages products.</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <h2>Register</h2>
          <p>Add your details to start using the store.</p>
          <form onSubmit={submitHandler} className="auth-form">
            <label>
              Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
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
            <label>
              Phone
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>
              Address
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button type="submit">Create Account</button>
            <p className="small-copy" style={{ marginTop: 16, textAlign: 'center' }}>
              Already have an account? <Link to="/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register
