import { useState } from 'react'
import { FiMail, FiCheck } from 'react-icons/fi'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitHandler = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setEmail('')
    // Fade success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section className="newsletter-section" style={{ margin: '80px 0 40px' }}>
      <div 
        className="newsletter-card" 
        style={{ 
          background: 'radial-gradient(circle at 10% 20%, #1e1b4b 0%, #0f172a 100%)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '56px 40px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle grid backdrop */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
            Exclusive Updates
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '8px' }}>
            Stay Ahead of the Curve
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: '460px', margin: '0 auto 32px', lineHeight: '1.5' }}>
            Subscribe to our weekly brief for early access discounts, campus releases, and tech drops.
          </p>

          <form 
            className="newsletter-form" 
            onSubmit={submitHandler}
            style={{
              display: 'flex',
              maxWidth: '480px',
              margin: '0 auto',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '99px',
              padding: '6px',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '14px', flex: 1 }}>
              <FiMail style={{ color: '#94a3b8', fontSize: '1.1rem' }} />
              <input
                type="email"
                placeholder="Enter your campus email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
                required
              />
            </div>
            <button 
              type="submit"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '99px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
              }}
            >
              Subscribe
            </button>
          </form>

          {submitted && (
            <p 
              className="success-text" 
              style={{ 
                marginTop: '16px', 
                color: '#34d399', 
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <FiCheck /> Subscription registered successfully. Thank you!
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter
