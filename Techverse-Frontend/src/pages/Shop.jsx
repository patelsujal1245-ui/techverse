import { useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { fallbackCategories, fallbackProducts, normalizeProduct, placeholderImage, safePrice } from '../data/catalog'
import { fetchCategories, fetchProducts } from '../services/productService'
import { 
  FiSearch, 
  FiArrowRight, 
  FiClock, 
  FiTruck, 
  FiPercent, 
  FiStar, 
  FiShoppingCart, 
  FiCheck 
} from 'react-icons/fi'

const Shop = () => {
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('featured')
  
  // Track adding state per product for micro-feedbacks
  const [addedProductId, setAddedProductId] = useState('')

  useEffect(() => {
    const loadShop = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ])
        const apiProducts = productsResponse.data || []
        const apiCategories = categoriesResponse.data || []
        setProducts(apiProducts.length ? apiProducts.map(normalizeProduct) : fallbackProducts)
        setCategories(apiCategories.length ? apiCategories : fallbackCategories)
      } catch {
        setProducts(fallbackProducts)
        setCategories(fallbackCategories)
      }
    }

    loadShop()
  }, [])

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All')
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  const displayedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || product.category === category
      return matchesSearch && matchesCategory
    })

    const sorted = [...filtered]
    if (sort === 'price-low') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-high') {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return sorted
  }, [products, search, category, sort])

  const getDeliveryDate = () => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 3)
    return targetDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const handleRowAddToCart = (product) => {
    addToCart(product)
    setAddedProductId(product._id)
    setTimeout(() => setAddedProductId(''), 1500)
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1100px', margin: '0 auto 60px' }}>
      
      {/* Top Filter Header */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>TechVerse Collection</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '8px' }}>
          Explore Products
        </h1>
        <p style={{ color: 'var(--muted)' }}>Browse our curated products, detailed specifications, and special checkout offers.</p>
      </div>

      {/* Filter Toolbar */}
      <div 
        className="toolbar" 
        style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          backgroundColor: '#ffffff', 
          padding: '16px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '40px'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--muted)' }} />
          <input
            type="search"
            placeholder="Search catalog, brands, or tech series..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 16px 10px 42px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)', 
              outline: 'none',
              fontSize: '0.88rem'
            }}
          />
        </div>
        
        <select 
          value={category} 
          onChange={(event) => setCategory(event.target.value)}
          style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', background: '#fff', cursor: 'pointer' }}
        >
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        
        <select 
          value={sort} 
          onChange={(event) => setSort(event.target.value)}
          style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', background: '#fff', cursor: 'pointer' }}
        >
          <option value="featured">Featured Picks</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch('')
            setCategory('All')
            setSort('featured')
            setSearchParams({})
          }}
          style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, background: '#fff' }}
        >
          Reset
        </button>
      </div>

      {displayedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <FiClock style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>No products match this selection</h3>
        </div>
      ) : (
        /* Widescreen Alternating Lookbook Layout */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {displayedProducts.map((product, index) => {
            const image = product.images?.[0] || placeholderImage
            const upiDiscountPrice = product.price * 0.95
            const reviewsCount = Math.floor((product.price % 300) + 42)
            const isLeft = index % 2 === 0
            const isAdded = addedProductId === product._id
            
            return (
              <article 
                key={product._id}
                className="editorial-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.2fr',
                  gap: '40px',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '32px',
                  boxShadow: 'var(--shadow-soft)',
                  direction: isLeft ? 'ltr' : 'rtl',
                  position: 'relative'
                }}
              >
                {/* Glowing light effect backdrop */}
                <div 
                  className="glow-aura"
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 65%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                    zIndex: -1,
                    filter: 'blur(20px)'
                  }}
                />

                {/* Product Media Column Wrapper */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', direction: 'ltr' }}>
                  <Link 
                    to={`/product/${product._id}`} 
                    style={{ 
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-soft)',
                      backgroundColor: '#ffffff',
                      padding: '12px',
                      maxWidth: '240px',
                      width: 'fit-content'
                    }}
                    className="editorial-image-wrapper"
                  >
                    <img 
                      src={image} 
                      alt={product.name} 
                      style={{ 
                        maxHeight: '210px', 
                        maxWidth: '100%', 
                        display: 'block',
                        objectFit: 'contain', 
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                      }}
                      className="card-product-img"
                      onError={(event) => {
                        event.currentTarget.src = placeholderImage
                      }}
                    />
                  </Link>
                </div>

                {/* Product Content Column */}
                <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="chip" style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>
                      {product.category}
                    </span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b', backgroundColor: '#fffbeb', padding: '2px 8px', borderRadius: '99px', border: '1px solid #fde047' }}>
                      <span>★</span>
                      <span>{(product.rating || 4.5).toFixed(1)}</span>
                      <span style={{ color: '#b45309', fontWeight: 500 }}>({reviewsCount})</span>
                    </div>
                  </div>

                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 850, color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.name}
                      </Link>
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
                      Brand: <strong style={{ color: 'var(--text)' }}>{product.brand}</strong>
                    </p>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
                    {product.description}
                  </p>

                  {/* Delivery & UPI Promo Tags */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#166534', backgroundColor: '#f0fdf4', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', fontWeight: 600 }}>
                      <FiTruck />
                      <span>Free delivery by <strong>{getDeliveryDate()}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#3730a3', backgroundColor: '#e0e7ff', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #c7d2fe', fontWeight: 600 }}>
                      <FiPercent />
                      <span>UPI price: <strong>{safePrice(upiDiscountPrice)}</strong></span>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>Selling Price</span>
                      <strong style={{ fontSize: '1.45rem', fontWeight: 800 }}>{safePrice(product.price)}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleRowAddToCart(product)}
                        style={{
                          padding: '10px 24px',
                          backgroundColor: isAdded ? '#10b981' : 'var(--accent)',
                          color: '#fff',
                          fontWeight: 800,
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                          boxShadow: isAdded ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none'
                        }}
                      >
                        {isAdded ? (
                          <>
                            <FiCheck style={{ fontSize: '1rem' }} /> Added!
                          </>
                        ) : (
                          <>
                            <FiShoppingCart /> Add to Cart
                          </>
                        )}
                      </button>
                      
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#ffffff',
                          color: 'var(--text)',
                          fontWeight: 700,
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        View Specs <FiArrowRight />
                      </Link>
                    </div>
                  </div>

                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Shop
