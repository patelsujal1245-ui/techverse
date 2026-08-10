import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ShopContext } from '../context/ShopContext'
import { fallbackProducts, normalizeProduct, placeholderImage, safePrice } from '../data/catalog'
import { fetchProduct, fetchProducts } from '../services/productService'
import { 
  FiHeart, 
  FiShoppingCart, 
  FiArrowLeft, 
  FiTruck, 
  FiShield, 
  FiRotateCcw, 
  FiCheckCircle, 
  FiPercent, 
  FiStar,
  FiMapPin
} from 'react-icons/fi'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [pincode, setPincode] = useState('')
  const [pincodeChecked, setPincodeChecked] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [{ data: productData }, { data: allProducts }] = await Promise.all([
          fetchProduct(id),
          fetchProducts(),
        ])
        const normalizedProduct = normalizeProduct(productData)
        setProduct(normalizedProduct)
        setRelated(
          (allProducts || [])
            .map(normalizeProduct)
            .filter((item) => item._id !== normalizedProduct._id && item.category === normalizedProduct.category)
            .slice(0, 4),
        )
      } catch {
        const fallbackProduct = fallbackProducts.find((item) => item._id === id) || fallbackProducts[0]
        setProduct(fallbackProduct)
        setRelated(fallbackProducts.filter((item) => item._id !== fallbackProduct._id).slice(0, 4))
      }
    }

    loadProduct()
  }, [id])

  if (!product) {
    return (
      <section className="page-shell" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--muted)' }}>Loading product details...</p>
      </section>
    )
  }

  const inWishlist = wishlist.some((item) => item._id === product._id)
  const upiDiscountPrice = product.price * 0.95
  const savingAmount = product.oldPrice ? product.oldPrice - product.price : 0
  const savingPercent = product.oldPrice ? Math.round((savingAmount / product.oldPrice) * 100) : 0
  const ratingsCount = Math.floor((product.price % 300) + 142)
  const isLowStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = product.stock <= 0

  // Get dynamic delivery date (current date + 3 days)
  const getDeliveryDate = () => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 3)
    return targetDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  const checkPincode = (e) => {
    e.preventDefault()
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      setPincodeChecked(true)
    } else {
      alert('Please enter a valid 6-digit PIN code.')
    }
  }

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Get dynamic reviews based on category
  const getFakeReviews = (categoryName) => {
    const norm = (categoryName || '').toLowerCase()
    
    // Tech / Electronics / Laptops / Smartwatches / Accessories / Gaming
    if (
      norm.includes('electronic') || 
      norm.includes('wearable') || 
      norm.includes('gaming') || 
      norm.includes('laptop') || 
      norm.includes('compute') || 
      norm.includes('audio') || 
      norm.includes('camera') || 
      norm.includes('tablet') || 
      norm.includes('smartphone') || 
      norm.includes('accessory') ||
      norm.includes('accessories')
    ) {
      return [
        {
          name: 'Sneha Patel',
          rating: 5,
          date: 'July 24, 2026',
          title: 'Outstanding performance!',
          comment: 'Absolutely premium build quality. The battery life is impressive and performance is lightning-fast. Highly recommended for students and professionals.'
        },
        {
          name: 'Vikram Malhotra',
          rating: 4,
          date: 'June 18, 2026',
          title: 'Very premium design, minor heating',
          comment: 'Superb screen color accuracy and robust body shell. It gets slightly warm under heavy multi-tasking but nothing alarming. Pay with UPI for the extra discount!'
        },
        {
          name: 'Rohan Sharma',
          rating: 5,
          date: 'May 30, 2026',
          title: 'Genuine tech product. Highly satisfied.',
          comment: 'Authentic item verified via system catalog. Delivery was incredibly quick, and the parcel was sealed securely. A solid upgrade.'
        },
        {
          name: 'Aishwarya R.',
          rating: 5,
          date: 'April 12, 2026',
          title: 'Value for Money',
          comment: 'Extremely good specs for this price point. Sound output is crisp and visual details are outstanding.'
        }
      ]
    }
    
    // Groceries / Food / Snacks / Liquids
    if (
      norm.includes('grocer') || 
      norm.includes('food') || 
      norm.includes('snack') || 
      norm.includes('drink') || 
      norm.includes('oil') ||
      norm.includes('choc') ||
      norm.includes('cadbury')
    ) {
      return [
        {
          name: 'Pooja Hegde',
          rating: 5,
          date: 'July 28, 2026',
          title: 'Absolutely fresh and delicious!',
          comment: 'Extremely rich taste and premium quality. The packaging was neat and protected the item from melting or getting crushed during delivery.'
        },
        {
          name: 'Amit Singhal',
          rating: 5,
          date: 'June 22, 2026',
          title: 'Authentic taste, great packaging',
          comment: 'Genuine brand pack. Delivery was swift, and the items received were fresh with plenty of shelf life remaining. Will order regularly!'
        },
        {
          name: 'Karan Mehra',
          rating: 5,
          date: 'May 15, 2026',
          title: 'Cheaper than local shops',
          comment: 'Got it with the extra 5% UPI discount which made it cheaper than local campus grocery stores. Perfectly satisfying!'
        },
        {
          name: 'Divya Rao',
          rating: 4,
          date: 'April 09, 2026',
          title: 'Very good snack pack',
          comment: 'Delicious quality, fresh stock, and delivered directly to the hostel corridor. Highly convenient!'
        }
      ]
    }

    // Personal Care / Cosmetics / Cleaners / Daily Essentials
    if (
      norm.includes('care') || 
      norm.includes('personal') || 
      norm.includes('clean') || 
      norm.includes('essential') || 
      norm.includes('body') ||
      norm.includes('wash')
    ) {
      return [
        {
          name: 'Shalini Sen',
          rating: 5,
          date: 'July 25, 2026',
          title: 'Extremely gentle & premium quality',
          comment: 'Feels amazing on skin and smells refreshing. High quality composition with zero harshness. A little amount goes a long way.'
        },
        {
          name: 'Harish Kumar',
          rating: 4,
          date: 'June 19, 2026',
          title: 'Very satisfying daily essential',
          comment: 'Cleanses effectively and leaves a clean, refreshing feeling. The packaging was sealed with tape to prevent any leakages during transit.'
        },
        {
          name: 'Nisha Gupta',
          rating: 5,
          date: 'May 11, 2026',
          title: 'Genuine brand care product',
          comment: 'Authentic personal care line item. Highly recommended for daily campus usage. Fast delivery and safe packing.'
        },
        {
          name: 'Rahul Roy',
          rating: 5,
          date: 'April 05, 2026',
          title: 'Good value daily wash',
          comment: 'Premium texture and long lasting freshness. Will purchase again!'
        }
      ]
    }

    // Default / General
    return [
      {
        name: 'Arjun Das',
        rating: 5,
        date: 'July 20, 2026',
        title: 'Excellent product quality!',
        comment: 'Exceeded my expectations. The build and material quality is highly durable and matches all descriptions perfectly.'
      },
      {
        name: 'Riya Sen',
        rating: 4,
        date: 'June 14, 2026',
        title: 'Very useful and practical',
        comment: 'Perfect for daily requirements. Delivery was swift, and the checkout discount via UPI was a nice money saver.'
      },
      {
        name: 'Deepak V.',
        rating: 5,
        date: 'May 28, 2026',
        title: 'Highly recommended',
        comment: 'Genuine product. The item arrived in pristine condition. Highly satisfied with TechVerse store response.'
      },
      {
        name: 'Megha Nair',
        rating: 5,
        date: 'April 01, 2026',
        title: 'Good value for money',
        comment: 'Decent packaging, reliable quality, and direct delivery. Perfect campus accessory.'
      }
    ]
  }

  const fakeReviews = getFakeReviews(product.category)

  return (
    <section className="page-shell" style={{ maxWidth: '1240px', margin: '0 auto 60px' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          <FiArrowLeft /> Back to Shop catalog
        </Link>
      </div>

      {/* Main Flipkart/Amazon Grid layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: '40px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-soft)'
        }}
        className="product-detail-container"
      >
        
        {/* Left Sticky Media & Actions Column */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div 
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              backgroundColor: 'var(--bg-soft)',
              display: 'grid',
              placeItems: 'center',
              aspectRatio: 1,
              marginBottom: '20px',
              overflow: 'hidden'
            }}
          >
            <img
              src={product.images?.[0] || placeholderImage}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', transition: 'transform 0.3s ease' }}
              onError={(event) => {
                event.currentTarget.src = placeholderImage
              }}
            />
          </div>

          {/* Core Checkout Buttons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button 
              type="button" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                padding: '16px',
                fontSize: '0.98rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isOutOfStock ? '#cbd5e1' : (added ? '#10b981' : '#ff9f00'),
                color: isOutOfStock ? '#64748b' : '#ffffff',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(255, 159, 0, 0.2)'
              }}
            >
              <FiShoppingCart /> {isOutOfStock ? 'Out of Stock' : (added ? 'Added to Cart!' : 'Add to Cart')}
            </button>
            
            <button 
              type="button" 
              onClick={() => toggleWishlist(product)}
              style={{
                padding: '16px',
                fontSize: '0.98rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: '#ffffff',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <FiHeart style={inWishlist ? { fill: '#ef4444', color: '#ef4444' } : {}} />
              {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Secure Shopping Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <FiShield style={{ fontSize: '1.4rem', color: '#3b82f6' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>100% Genuine</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <FiRotateCcw style={{ fontSize: '1.4rem', color: '#10b981' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>7 Days Return</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <FiTruck style={{ fontSize: '1.4rem', color: '#8b5cf6' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>Free Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Product Specifications & Info Column */}
        <div>
          <span className="chip" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '8px', display: 'inline-block' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.25, marginBottom: '6px' }}>
            {product.name}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '8px' }}>
            Brand: <strong style={{ color: 'var(--text)' }}>{product.brand}</strong>
          </p>
          {isOutOfStock ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', width: 'fit-content', marginBottom: '16px' }}>
              Out of Stock (Currently unavailable)
            </div>
          ) : isLowStock ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#fffbeb', border: '1px solid #fde047', color: '#b45309', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', width: 'fit-content', marginBottom: '16px' }}>
              Hurry! Only {product.stock} pieces left in stock.
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem', width: 'fit-content', marginBottom: '16px' }}>
              In Stock ({product.stock} units available)
            </div>
          )}

          {/* Star Rating Breakdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', backgroundColor: '#388e3c', padding: '3px 10px', borderRadius: '4px' }}>
              <span>{(product.rating || 4.5).toFixed(1)}</span>
              <FiStar style={{ fill: '#fff' }} />
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '0.88rem', fontWeight: 600 }}>
              {ratingsCount} Verified Ratings & {fakeReviews.length} Reviews
            </span>
          </div>

          {/* Pricing & Discounts Layout */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)' }}>
                {safePrice(product.price)}
              </span>
              {product.oldPrice ? (
                <>
                  <span style={{ fontSize: '1.15rem', color: 'var(--muted)', textDecoration: 'line-through' }}>
                    {safePrice(product.oldPrice)}
                  </span>
                  <span style={{ fontSize: '1.15rem', color: '#388e3c', fontWeight: 700 }}>
                    {savingPercent}% Off
                  </span>
                </>
              ) : null}
            </div>
            
            {product.oldPrice ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 16px 0' }}>
                You save: <strong>{safePrice(savingAmount)}</strong> (Inclusive of all taxes)
              </p>
            ) : null}

            {/* UPI Special Discount Offer Card */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)',
                border: '1px solid #c7d2fe',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start'
              }}
            >
              <FiPercent style={{ fontSize: '1.8rem', color: '#4f46e5', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: '#1e1b4b', marginBottom: '4px' }}>
                  UPI Instant Discount Offer
                </strong>
                <span style={{ display: 'block', fontSize: '0.88rem', color: '#3730a3', lineHeight: '1.4' }}>
                  Get an extra <strong>5% instant discount</strong> when checking out via UPI. Pay only <strong style={{ color: '#4f46e5', fontSize: '1rem' }}>{safePrice(upiDiscountPrice)}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Pin Code Checker Widget */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Delivery Details</h4>
            <form onSubmit={checkPincode} style={{ display: 'flex', gap: '8px', maxWidth: '320px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', flex: 1, backgroundColor: '#ffffff' }}>
                <FiMapPin style={{ color: 'var(--muted)' }} />
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: '0.88rem', width: '100%' }}
                />
              </div>
              <button 
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Check
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#166534', fontWeight: 600 }}>
              <FiTruck />
              <span>
                {pincodeChecked 
                  ? `Express shipping active! Guaranteed delivery by tomorrow` 
                  : `Free standard delivery by ${getDeliveryDate()}`
                }
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', marginBottom: '10px' }}>Product Overview</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              {product.description}
            </p>
          </div>

          {/* Product Specifications Sheet */}
          {product.specifications ? (
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>Product Specifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div 
                    key={key} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1.2fr 1.8fr', 
                      padding: '12px 16px', 
                      fontSize: '0.88rem',
                      backgroundColor: index % 2 === 0 ? 'var(--bg-soft)' : '#ffffff',
                      borderBottom: index === Object.keys(product.specifications).length - 1 ? 'none' : '1px solid var(--border)'
                    }}
                  >
                    <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{key}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 700 }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Flipkart/Amazon Customer Reviews Widget */}
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>Customer Reviews</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {fakeReviews.map((rev, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '16px', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'var(--bg-soft)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                        {rev.name.charAt(0)}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{rev.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#166534', backgroundColor: '#e0fdf4', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                        <FiCheckCircle /> Verified Purchase
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{rev.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        style={{ 
                          fill: i < rev.rating ? '#f59e0b' : 'none', 
                          color: i < rev.rating ? '#f59e0b' : 'var(--border)' 
                        }} 
                      />
                    ))}
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text)', marginLeft: '6px' }}>{rev.title}</strong>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Section */}
      <div className="section-header spaced-top" style={{ marginTop: '56px', marginBottom: '24px' }}>
        <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Related Products</span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>Frequently Bought Together</h2>
        <p style={{ color: 'var(--muted)' }}>Check matching active accessories from the same catalog category.</p>
      </div>

      <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        {related.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            inWishlist={wishlist.some((wish) => wish._id === item._id)}
          />
        ))}
      </div>

    </section>
  )
}

export default ProductDetails
