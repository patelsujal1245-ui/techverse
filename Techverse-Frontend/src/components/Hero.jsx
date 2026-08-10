import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShoppingCart, FiCpu, FiStar, FiShoppingBag } from 'react-icons/fi'
import { placeholderImage } from '../data/catalog'

const Hero = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState('All')
  const [rotationDegree, setRotationDegree] = useState(0)

  // Get one featured product per category dynamically
  const showcaseProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    
    // Group products by category
    const categories = ['Audio', 'Wearables', 'Laptops', 'Cameras', 'Gaming']
    const selected = []
    
    categories.forEach(cat => {
      const match = products.find(p => p.category === cat)
      if (match) selected.push(match)
    })
    
    // Fallback to top products if categories are missing
    if (selected.length === 0) {
      return products.slice(0, 5)
    }
    return selected
  }, [products])

  // Active product based on tab selection
  const activeProduct = useMemo(() => {
    if (showcaseProducts.length === 0) return null
    if (activeTab === 'All') return showcaseProducts[0]
    return showcaseProducts.find(p => p.category === activeTab) || showcaseProducts[0]
  }, [showcaseProducts, activeTab])

  // Trigger rotation animation on tab changes
  useEffect(() => {
    setRotationDegree(prev => prev + 360)
  }, [activeTab])

  // Auto-switch tabs every 8 seconds unless interacted
  useEffect(() => {
    if (showcaseProducts.length <= 1) return
    
    const timer = setInterval(() => {
      setActiveTab(prev => {
        const currentIdx = showcaseProducts.findIndex(p => p.category === prev)
        const nextIdx = (currentIdx + 1) % showcaseProducts.length
        return showcaseProducts[nextIdx]?.category || 'All'
      })
    }, 8000)
    
    return () => clearInterval(timer)
  }, [showcaseProducts])

  if (!activeProduct) {
    return (
      <div style={{ height: '380px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: 'var(--radius-xl)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)', margin: '20px 0 56px' }}>
        <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading interactive tech collections...</p>
      </div>
    )
  }

  const upiPrice = activeProduct.price * 0.95
  const isLowStock = activeProduct.stock > 0 && activeProduct.stock <= 5
  const isOut = activeProduct.stock <= 0

  return (
    <section 
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #fbfcfe 50%, #f4f7fe 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '50px 6%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -25px rgba(15, 23, 42, 0.06), var(--shadow-soft)',
        margin: '20px 0 56px'
      }}
      className="hero-redesign"
    >
      {/* Soft pastel blur background elements */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(45px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 70%)',
          filter: 'blur(35px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* LEFT COLUMN: Asymmetrical Bold Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Interactive Category Selector Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {showcaseProducts.map((p) => {
            const isActive = activeTab === p.category
            return (
              <button
                key={p._id}
                onClick={() => setActiveTab(p.category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.04)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {p.category}
              </button>
            )
          })}
        </div>

        {/* Hero Title */}
        <h1 
          style={{ 
            fontSize: '3.6rem', 
            fontWeight: 950, 
            lineHeight: '1.05', 
            letterSpacing: '-0.04em', 
            color: 'var(--text)', 
            margin: 0 
          }}
        >
          Curated. High-End.<br />
          <span 
            style={{ 
              background: 'linear-gradient(135deg, var(--accent) 0%, #db2777 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}
          >
            Campus Tech Drops.
          </span>
        </h1>

        {/* Hero Description */}
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0, maxWidth: '520px' }}>
          Experience the next level of computation and immersive audio. Handpicked catalogs with automated stock alerts and instant UPI payments discounts.
        </p>

        {/* Core details checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text)', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
            <span>Instant 5% discount when paying with UPI method</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
            <span>Live local warehouse inventory synchronization</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
          <Link 
            to={`/product/${activeProduct._id}`} 
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              padding: '14px 32px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
              transition: 'all 0.3s ease'
            }}
            className="hero-new-primary"
          >
            Explore Product <FiArrowRight />
          </Link>
          <Link 
            to="/shop" 
            style={{
              backgroundColor: '#ffffff',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              padding: '14px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'var(--shadow-soft)'
            }}
            className="hero-new-secondary"
          >
            View All Catalog
          </Link>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Floating Glass Spec Panel */}
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '340px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), var(--shadow-soft)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Rating floating tag */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '-12px', 
              left: '20px', 
              backgroundColor: '#ffffff', 
              border: '1px solid var(--border)', 
              borderRadius: '99px', 
              padding: '4px 12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            <FiStar style={{ color: '#eab308', fill: '#eab308' }} /> {activeProduct.rating ? activeProduct.rating.toFixed(1) : '4.5'} Rating
          </div>

          {/* Product Image Frame */}
          <div 
            style={{ 
              height: '200px', 
              display: 'grid', 
              placeItems: 'center', 
              background: 'radial-gradient(circle, #f8fafc 0%, #ffffff 100%)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img 
              src={activeProduct.images?.[0] || placeholderImage} 
              alt={activeProduct.name}
              style={{ 
                maxHeight: '160px', 
                maxWidth: '90%', 
                objectFit: 'contain',
                transform: `rotate(${rotationDegree}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.06))'
              }}
            />
          </div>

          {/* Name & Stock info */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>
              {activeProduct.brand}
            </span>
            <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeProduct.name}
            </strong>
          </div>

          {/* Pricing Row with UPI Promo */}
          <div 
            style={{ 
              backgroundColor: '#eff6ff', 
              border: '1px solid #bfdbfe', 
              borderRadius: 'var(--radius-md)', 
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>Regular: {activeProduct.price ? `₹${activeProduct.price.toLocaleString('en-IN')}` : '₹0'}</span>
              <strong style={{ fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 900 }}>₹{upiPrice.toLocaleString('en-IN')}</strong>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#1e40af', fontWeight: 800 }}>⚡ 5% Instant UPI Discount Applied</span>
          </div>

          {/* Stock Availability Footer Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {isOut ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c' }}>Out of Stock</span>
              ) : isLowStock ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>Only {activeProduct.stock} left!</span>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>In Stock (Warehouse synced)</span>
              )}
            </div>
            <Link 
              to={`/product/${activeProduct._id}`}
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--accent)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Specifications <FiArrowRight />
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        .hero-new-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(15,23,42,0.25) !important;
        }
        .hero-new-secondary:hover {
          background-color: var(--bg-soft) !important;
        }
      `}</style>

    </section>
  )
}

export default Hero
