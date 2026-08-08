import ProductCard from './ProductCard'

const FeaturedProducts = ({ products, onAddToCart, onToggleWishlist, wishlistIds = [], theme = 'light' }) => {
  const isDark = theme === 'dark'
  
  return (
    <section className="featured-section" style={{ padding: '40px 0' }}>
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Store Highlights</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--text)', marginBottom: '8px' }}>Featured Products</h2>
        <p style={{ color: isDark ? '#cbd5e1' : 'var(--muted)', fontSize: '0.95rem' }}>Top picks from the catalog, ready for browsing and quick add-to-cart actions.</p>
      </div>
      <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
        {products.slice(0, 3).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            inWishlist={wishlistIds.includes(product._id)}
            layout="grid"
            theme={theme}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
