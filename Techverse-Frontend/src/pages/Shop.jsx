import { useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import { fallbackCategories, fallbackProducts, normalizeProduct, safePrice } from '../data/catalog'
import { fetchCategories, fetchProducts } from '../services/productService'
import { 
  FiSearch, 
  FiClock, 
  FiFilter,
  FiSliders,
  FiXCircle,
  FiAlertTriangle
} from 'react-icons/fi'

const Shop = () => {
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Data States
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [loading, setLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(250000)
  const [selectedBrands, setSelectedBrands] = useState([])
  const [stockFilter, setStockFilter] = useState('all') // 'all', 'in-stock', 'low-stock', 'out-of-stock'

  // Load Categories and Products
  useEffect(() => {
    const loadShop = async () => {
      try {
        setLoading(true)
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ])
        const apiProducts = productsResponse.data || []
        const apiCategories = categoriesResponse.data || []
        
        const normalized = apiProducts.length ? apiProducts.map(normalizeProduct) : fallbackProducts
        setProducts(normalized)
        setCategories(apiCategories.length ? apiCategories : fallbackCategories)
        
        // Auto-initialize maxPrice to highest product price
        if (normalized.length > 0) {
          const maxP = Math.max(...normalized.map(p => p.price || 0), 200000)
          setMaxPrice(maxP)
        }
      } catch {
        setProducts(fallbackProducts)
        setCategories(fallbackCategories)
      } finally {
        setLoading(false)
      }
    }

    loadShop()
  }, [])

  // Sync SearchParams URL changes
  useEffect(() => {
    setCategory(searchParams.get('category') || 'All')
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  // Extract unique brands dynamically from products catalog list
  const uniqueBrands = useMemo(() => {
    const brands = products.map(p => p.brand).filter(Boolean)
    return Array.from(new Set(brands)).sort()
  }, [products])

  // Toggle brand selection
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  // Filter and Sort Logic
  const displayedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = category === 'All' || product.category === category
      const matchesPrice = product.price <= maxPrice
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      
      let matchesStock = true
      if (stockFilter === 'in-stock') {
        matchesStock = product.stock > 0
      } else if (stockFilter === 'low-stock') {
        matchesStock = product.stock > 0 && product.stock <= 5
      } else if (stockFilter === 'out-of-stock') {
        matchesStock = product.stock <= 0
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesStock
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
  }, [products, search, category, maxPrice, selectedBrands, stockFilter, sort])

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('')
    setCategory('All')
    setSort('featured')
    setSelectedBrands([])
    setStockFilter('all')
    const maxP = Math.max(...products.map(p => p.price || 0), 200000)
    setMaxPrice(maxP)
    setSearchParams({})
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1300px', margin: '0 auto 60px' }}>
      
      {/* Top Banner Header */}
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
          Catalog Collection
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 850, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '8px' }}>
          Shop Collection
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Browse high-performance devices, verify real-time warehouse availability, and get direct payment discounts.</p>
      </div>

      {/* Main Two-Column Shop Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Sidebar Filter Panel */}
        <aside 
          style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px', 
            boxShadow: 'var(--shadow-soft)',
            position: 'sticky',
            top: '100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              <FiFilter /> Filters
            </div>
            <button 
              onClick={handleResetFilters}
              style={{ fontSize: '0.78rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Reset All
            </button>
          </div>

          {/* Search Filter */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '0.02em', marginBottom: '10px' }}>Search</span>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--muted)' }} />
              <input
                type="search"
                placeholder="Product, brand, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Category List Selector */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '0.02em', marginBottom: '10px' }}>Category</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setCategory('All')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: category === 'All' ? 'var(--bg-soft)' : 'transparent',
                  color: category === 'All' ? 'var(--text)' : 'var(--muted)',
                  fontWeight: category === 'All' ? 700 : 500,
                  fontSize: '0.85rem',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                All Categories
              </button>
              {categories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCategory(item.name)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: category === item.name ? 'var(--bg-soft)' : 'transparent',
                    color: category === item.name ? 'var(--text)' : 'var(--muted)',
                    fontWeight: category === item.name ? 700 : 500,
                    fontSize: '0.85rem',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter (Checklist) */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '0.02em', marginBottom: '10px' }}>Brand</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
              {uniqueBrands.map((brand) => (
                <label 
                  key={brand} 
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text)' }}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '0.02em' }}>Max Price</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>{safePrice(maxPrice)}</strong>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(...products.map(p => p.price || 0), 200000)}
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>
              <span>{safePrice(0)}</span>
              <span>{safePrice(Math.max(...products.map(p => p.price || 0), 200000))}</span>
            </div>
          </div>

          {/* Stock Availability Filter */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', letterSpacing: '0.02em', marginBottom: '10px' }}>Availability</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="stock-filter"
                  checked={stockFilter === 'all'}
                  onChange={() => setStockFilter('all')}
                />
                <span>All Catalog Items</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="stock-filter"
                  checked={stockFilter === 'in-stock'}
                  onChange={() => setStockFilter('in-stock')}
                />
                <span>In Stock Only</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="stock-filter"
                  checked={stockFilter === 'low-stock'}
                  onChange={() => setStockFilter('low-stock')}
                />
                <span>Low Stock Warning (≤ 5)</span>
              </label>
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: Results Header & Product Grid */}
        <div>
          
          {/* Grid Toolbar Header */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: '#ffffff', 
              padding: '16px 24px', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-soft)',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '0.88rem', color: 'var(--muted)', fontWeight: 600 }}>
              Showing <strong style={{ color: 'var(--text)' }}>{displayedProducts.length}</strong> products
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>Sort By:</span>
              <select 
                value={sort} 
                onChange={(event) => setSort(event.target.value)}
                style={{ 
                  padding: '6px 12px', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.85rem', 
                  outline: 'none', 
                  background: '#fff', 
                  cursor: 'pointer',
                  fontWeight: 700 
                }}
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading collection catalog...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <FiXCircle style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>No Matching Products</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Try resetting the filters or broadening your search parameters.</p>
              <button 
                onClick={handleResetFilters}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: '24px' 
              }}
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  inWishlist={wishlist.some((item) => item._id === product._id)}
                  layout="grid"
                  theme="light"
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </section>
  )
}

export default Shop
