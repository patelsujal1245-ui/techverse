import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Hero = () => (
  <section className="hero-section">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero-grid"
    >
      <div className="hero-copy">
        <p className="eyebrow">Curated electronics for everyday use</p>
        <h1>Clean essentials for campus, work, and home.</h1>
        <p>
          TechVerse is a simple electronics store with real shopping flow, local product data,
          admin management, and a calm modern interface.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="hero-button">
            Browse Products
          </Link>
          <Link to="/register" className="hero-button secondary">
            Create Account
          </Link>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>12+</strong>
            <span>products</span>
          </div>
          <div>
            <strong>8</strong>
            <span>categories</span>
          </div>
          <div>
            <strong>3</strong>
            <span>core flows</span>
          </div>
        </div>
      </div>

      <div className="hero-showcase">
        <div className="showcase-card showcase-large">
          <span>Featured</span>
          <strong>Everyday Audio</strong>
          <p>Minimal design, practical features, and a sharp presentation.</p>
        </div>
        <div className="showcase-grid">
          <div className="showcase-card">
            <span>Wearables</span>
            <strong>Smartwatch</strong>
          </div>
          <div className="showcase-card">
            <span>Essentials</span>
            <strong>Power bank</strong>
          </div>
          <div className="showcase-card">
            <span>Productivity</span>
            <strong>Laptop</strong>
          </div>
          <div className="showcase-card">
            <span>Gaming</span>
            <strong>Keyboard</strong>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
)

export default Hero
