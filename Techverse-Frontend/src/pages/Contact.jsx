import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiChevronDown, FiChevronUp, FiMessageSquare } from 'react-icons/fi'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', type: 'Complaint', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const triggerAIChat = (topic = '') => {
    window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { topic } }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
    setForm({ name: '', email: '', type: 'Complaint', message: '' })
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
    {
      q: 'How do I track my order delivery?',
      a: 'Once logged in, click on your Profile in the top navigation bar. Under the "Order History" section, you can check real-time status and live tracking of tech and grocery packages.'
    },
    {
      q: 'What is your refund policy for fresh foods?',
      a: 'We offer a 100% money-back guarantee. If you receive grocery items that do not meet freshness standards, you can submit a return request within 24 hours of delivery.'
    },
    {
      q: 'How long do tech accessories take to ship?',
      a: 'Tech items are dispatched from our Noida warehouse within 24 hours. Delivery usually takes 1-3 business days depending on your local region.'
    },
    {
      q: 'How do I lodge a formal complaint?',
      a: 'You can use the interactive AI Support Chatbot floating in the bottom-right corner of the site. Typing "complaint" triggers our automated support desk and logs a ticket number.'
    }
  ]

  return (
    <section className="page-shell" style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 0 60px' }}>
      {/* Brand Hero Header */}
      <div 
        className="contact-hero" 
        style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          marginBottom: '48px',
          position: 'relative'
        }}
      >
        <span 
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#7c3aed',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'inline-block',
            marginBottom: '16px'
          }}
        >
          Customer Support Portal
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '20px', letterSpacing: '-0.04em', lineHeight: '1.15' }}>
          Get Solutions Instantly
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.65' }}>
          Have an order issue, broken product, or need delivery assistance? Lodge a query below or talk directly to our AI helper.
        </p>
      </div>

      {/* AI Grievance Quick Categories Section */}
      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
        AI Guided Grievance Launchers
      </h3>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '48px'
        }}
        className="contact-launchers-grid"
      >
        <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <strong style={{ color: '#b91c1c', fontSize: '0.95rem' }}>⚠️ Priority Complaints</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.4' }}>Submit urgent reports for damaged tech, missing goods, or delivery delays.</span>
          <button 
            onClick={() => triggerAIChat('Lodge a complaint')}
            style={{
              marginTop: 'auto',
              padding: '8px 16px',
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <FiMessageSquare /> AI Complaint Guide
          </button>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <strong style={{ color: '#1e3a8a', fontSize: '0.95rem' }}>📦 Order Tracking</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.4' }}>Inquire about transit stages, dispatch delays, or express courier estimates.</span>
          <button 
            onClick={() => triggerAIChat('Track my delivery')}
            style={{
              marginTop: 'auto',
              padding: '8px 16px',
              backgroundColor: '#eff6ff',
              color: '#1e3a8a',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <FiMessageSquare /> AI Delivery Guide
          </button>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <strong style={{ color: '#115e59', fontSize: '0.95rem' }}>💳 Refunds & Returns</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.4' }}>Review return validity periods, request money back, or cancel order logs.</span>
          <button 
            onClick={() => triggerAIChat('Refund Policy')}
            style={{
              marginTop: 'auto',
              padding: '8px 16px',
              backgroundColor: '#f0fdf4',
              color: '#115e59',
              border: '1px solid #99f6e4',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <FiMessageSquare /> AI Refund Guide
          </button>
        </div>
      </div>

      {/* Main Grid: Form vs Info */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          marginBottom: '56px'
        }}
        className="contact-main-grid"
      >
        {/* Form Side */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <FiCheckCircle style={{ fontSize: '3rem', color: '#10b981', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                Grievance Form Submitted
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
                Your ticket has been logged into our support queue. An agent will contact you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: '24px',
                  padding: '10px 20px',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                Send Support Request
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-double">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter name"
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9rem', background: 'var(--bg-soft)', color: 'var(--text)' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter email"
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9rem', background: 'var(--bg-soft)', color: 'var(--text)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>Query Category</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9rem', background: 'var(--bg-soft)', color: 'var(--text)', cursor: 'pointer' }}
                >
                  <option value="Complaint">Lodge a Complaint (Urgent)</option>
                  <option value="Refund">Return or Refund Status</option>
                  <option value="Order Tracking">Order & Delivery Query</option>
                  <option value="Feedback">Store Feedback</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>Message / Grievance Description</label>
                <textarea 
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your request or order ID..."
                  style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9rem', resize: 'none', background: 'var(--bg-soft)', color: 'var(--text)' }}
                />
              </div>

              <button 
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  width: 'fit-content',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FiSend /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f5f3ff', display: 'grid', placeItems: 'center', color: '#7c3aed', fontSize: '1.1rem', shrink: 0 }}>
              <FiMail />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text)' }}>Email Support</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', margin: '2px 0 6px' }}>Direct desk response in under 2 hours.</span>
              <a href="mailto:support@techverse.com" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7c3aed' }}>support@techverse.com</a>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'grid', placeItems: 'center', color: '#166534', fontSize: '1.1rem', shrink: 0 }}>
              <FiPhone />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text)' }}>Corporate Hotline</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', margin: '2px 0 6px' }}>Mon-Fri, 9:00 AM to 6:00 PM IST.</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#166534' }}>+91 90000 00000</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fffbeb', display: 'grid', placeItems: 'center', color: '#854d0e', fontSize: '1.1rem', shrink: 0 }}>
              <FiMapPin />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text)' }}>Headquarters</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', margin: '2px 0' }}>
                TechVerse Hub, Sector 62, Noida, UP, India.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginBottom: '24px', letterSpacing: '-0.02em', textAlign: 'center' }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="contact-faqs">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            <button
              onClick={() => toggleFaq(index)}
              style={{
                width: '100%',
                padding: '16px 20px',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'transparent',
                fontWeight: 600,
                color: 'var(--text)',
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>{faq.q}</span>
              {activeFaq === index ? <FiChevronUp style={{ color: 'var(--muted)' }} /> : <FiChevronDown style={{ color: 'var(--muted)' }} />}
            </button>
            
            {activeFaq === index && (
              <div 
                style={{
                  padding: '0 20px 16px 20px',
                  color: 'var(--muted)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  borderTop: '1px solid rgba(15, 23, 42, 0.03)',
                  paddingTop: '12px'
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Contact
