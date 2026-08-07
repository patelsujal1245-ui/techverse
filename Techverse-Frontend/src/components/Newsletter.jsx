import { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitHandler = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <h2>Stay updated</h2>
        <p>Join our newsletter for latest offers and product drops.</p>
        <form className="newsletter-form" onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {submitted ? (
          <p className="success-text">Thanks for subscribing. This demo form is working.</p>
        ) : null}
      </div>
    </section>
  )
}

export default Newsletter
