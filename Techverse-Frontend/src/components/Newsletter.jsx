import { useState } from 'react'
import { FiMail, FiCheck } from 'react-icons/fi'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

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
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '56px 40px',
          textAlign: 'center',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.05), var(--shadow-soft)',
          color: 'var(--text)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle grid backdrop */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(var(--text) 1px, transparent 1px)', backgroundSize: '16px 16px', pointerEvents: 'none' }} />

        {/* Ambient decorative blur orbs */}
        <div 
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
            Exclusive Updates
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '8px' }}>
            Stay Ahead of the Curve
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.98rem', maxWidth: '460px', margin: '0 auto 32px', lineHeight: '1.5' }}>
            Subscribe to our weekly brief for early access discounts, campus releases, and tech drops.
          </p>

          <form 
            className="newsletter-form" 
            onSubmit={submitHandler}
            style={{
              display: 'flex',
              maxWidth: '480px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              border: inputFocused ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '99px',
              padding: '6px',
              alignItems: 'center',
              boxShadow: inputFocused ? '0 8px 24px rgba(15, 23, 42, 0.06)' : 'var(--shadow-soft)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '14px', flex: 1 }}>
              <FiMail style={{ color: 'var(--muted)', fontSize: '1.1rem' }} />
              <input
                type="email"
                placeholder="Enter your campus email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
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
                padding: '12px 28px',
                borderRadius: '99px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
              }}
              className="newsletter-btn"
            >
              Subscribe
            </button>
          </form>

          {submitted && (
            <p 
              className="success-text" 
              style={{ 
                marginTop: '20px', 
                color: '#059669', 
                fontSize: '0.88rem',
                fontWeight: 700,
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
      <style>{`
        .newsletter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25) !important;
        }
      `}</style>
    </section>
  )
}

export default Newsletter
