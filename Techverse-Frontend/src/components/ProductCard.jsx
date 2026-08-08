import { useState } from 'react'
import { Link } from 'react-router-dom'
import { placeholderImage, safePrice } from '../data/catalog'
import { FiHeart, FiShoppingCart, FiCheck, FiTruck, FiInfo } from 'react-icons/fi'

const ProductCard = ({ product, onAddToCart, onToggleWishlist, inWishlist, layout = 'list', theme = 'light' }) => {
  const [added, setAdded] = useState(false)
  const image = product.images?.[0] || placeholderImage

  const handleAddToCart = (e) => {
    e.preventDefault()
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  // Get dynamic delivery date (current date + 3 days)
  const getDeliveryEstimation = () => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 3)
    return targetDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Calculate UPI discount price (5% off)
  const upiDiscountPrice = product.price * 0.95
  const reviewsCount = Math.floor((product.price % 300) + 42) // Semi-random realistic review counts

  const isDark = theme === 'dark'

  if (layout === 'list') {
    return (
      <article 
        className="product-card-list" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '240px 1fr 240px', 
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '20px',
          width: '100%'
        }}
      >
        {/* Left Column: Image & Wishlist */}
        <div style={{ position: 'relative', background: isDark ? '#0f172a' : 'var(--bg-soft)', display: 'grid', placeItems: 'center', padding: '16px' }}>
          <Link to={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
            <img
              src={image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '180px' }}
              onError={(event) => {
                event.currentTarget.src = placeholderImage
              }}
            />
          </Link>
          <button
            type="button"
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={() => onToggleWishlist(product)}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              zIndex: 2,
              transition: 'all 0.2s ease'
            }}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart style={inWishlist ? { fill: '#ef4444', color: '#ef4444' } : { color: '#6b7280' }} />
          </button>
        </div>

        {/* Middle Column: Metadata, Description */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="chip" style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', color: isDark ? '#94a3b8' : 'var(--muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              {product.category}
            </span>
            <div className="product-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', backgroundColor: isDark ? '#334155' : '#fffbeb', padding: '2px 8px', borderRadius: '99px', border: '1px solid #fde047' }}>
              <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>★</span>
              <span style={{ color: isDark ? '#fbbf24' : '#b45309' }}>{(product.rating || 4.5).toFixed(1)}</span>
              <span style={{ color: isDark ? '#fbbf24' : '#d97706', fontSize: '0.75rem', fontWeight: 500 }}>({reviewsCount})</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {product.name}
            </Link>
          </h3>
          <p style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : 'var(--muted)', margin: 0 }}>
            Brand: <strong style={{ color: isDark ? '#cbd5e1' : 'var(--text)' }}>{product.brand}</strong>
          </p>

          <p style={{ fontSize: '0.9rem', color: isDark ? '#cbd5e1' : 'var(--muted)', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        </div>

        {/* Right Column: Checkout Pricing & Add to Cart button */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', backgroundColor: isDark ? '#1e293b' : '#fcfcfd' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--text)' }}>{safePrice(product.price)}</strong>
              {product.oldPrice ? <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>{safePrice(product.oldPrice)}</span> : null}
            </div>
            {product.oldPrice && (
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Delivery & UPI Offers simplified for List layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: isDark ? '#34d399' : '#166534', fontWeight: 600 }}>
              <FiTruck style={{ flexShrink: 0 }} />
              <span>Delivered by <strong>{getDeliveryEstimation()}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: isDark ? '#818cf8' : '#3730a3', fontWeight: 600 }}>
              <span style={{ background: '#4f46e5', color: '#fff', padding: '1px 4px', borderRadius: '3px', fontSize: '0.62rem', fontWeight: 800 }}>UPI</span>
              <span><strong>{safePrice(upiDiscountPrice)}</strong> with UPI</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: added ? '#10b981' : 'var(--accent)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: added ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none'
            }}
          >
            {added ? (
              <>
                <FiCheck style={{ fontSize: '1rem' }} /> Added!
              </>
            ) : (
              <>
                <FiShoppingCart style={{ fontSize: '0.95rem' }} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </article>
    )
  }

  // Grid view (Default used on homepage)
  return (
    <article 
      className="product-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : 'var(--shadow-soft)'
      }}
    >
      <div style={{ position: 'relative' }}>
        <Link to={`/product/${product._id}`} className="product-media" style={{ display: 'block', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: isDark ? '#0f172a' : 'var(--bg-soft)', aspectRatio: 1 }}>
          <img
            src={image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }}
            className="card-product-img"
            onError={(event) => {
              event.currentTarget.src = placeholderImage
            }}
          />
        </Link>
        <button
          type="button"
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={() => onToggleWishlist(product)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'all 0.2s ease'
          }}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart style={inWishlist ? { fill: '#ef4444', color: '#ef4444' } : { color: '#6b7280' }} />
        </button>
      </div>

      <div className="product-meta" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: '16px' }}>
        <div className="product-meta-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="chip" style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', color: isDark ? '#94a3b8' : 'var(--muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
            {product.category}
          </span>
          <div className="product-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', backgroundColor: isDark ? '#334155' : '#fffbeb', padding: '2px 8px', borderRadius: '99px', border: '1px solid #fde047' }}>
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>★</span>
            <span style={{ color: isDark ? '#fbbf24' : '#b45309' }}>{(product.rating || 4.5).toFixed(1)}</span>
            <span style={{ color: isDark ? '#fbbf24' : '#d97706', fontSize: '0.75rem', fontWeight: 500 }}>({reviewsCount})</span>
          </div>
        </div>
        
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--text)', marginBottom: '4px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.name}
          </Link>
        </h3>
        <p className="brand-name" style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : 'var(--muted)', marginBottom: '8px' }}>{product.brand}</p>
        
        {/* Delivery Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: isDark ? '#34d399' : '#166534', backgroundColor: isDark ? 'rgba(52,211,153,0.08)' : '#f0fdf4', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '8px', border: isDark ? '1px solid rgba(52,211,153,0.15)' : '1px solid #bbf7d0', fontWeight: 600 }}>
          <FiTruck style={{ flexShrink: 0 }} />
          <span>Free delivery by <strong>{getDeliveryEstimation()}</strong></span>
        </div>

        {/* UPI Extra Discount Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: isDark ? '#818cf8' : '#3730a3', backgroundColor: isDark ? 'rgba(129,140,248,0.08)' : '#e0e7ff', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', border: isDark ? '1px solid rgba(129,140,248,0.15)' : '1px solid #c7d2fe', fontWeight: 600 }}>
          <span style={{ background: '#4f46e5', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 800 }}>UPI</span>
          <span>Pay <strong>{safePrice(upiDiscountPrice)}</strong> (Extra 5% Off)</span>
        </div>
        
        <p className="product-description" style={{ fontSize: '0.85rem', color: isDark ? '#cbd5e1' : 'var(--muted)', lineHeight: '1.4', marginBottom: '16px', height: '2.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        
        <div style={{ marginTop: 'auto' }}>
          <div className="price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--text)' }}>{safePrice(product.price)}</strong>
            {product.oldPrice ? <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>{safePrice(product.oldPrice)}</span> : null}
          </div>
          <div className="card-actions">
            <button 
              type="button" 
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: added ? '#10b981' : 'var(--accent)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: added ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              {added ? (
                <>
                  <FiCheck style={{ fontSize: '1rem' }} /> Added!
                </>
              ) : (
                <>
                  <FiShoppingCart style={{ fontSize: '0.95rem' }} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
