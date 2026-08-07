import ProductCard from './ProductCard'

const FeaturedProducts = ({ products, onAddToCart, onToggleWishlist, wishlistIds = [] }) => (
  <section className="featured-section">
    <div className="section-header">
      <h2>Featured Products</h2>
      <p>Top picks from the catalog, ready for browsing and quick add-to-cart actions.</p>
    </div>
    <div className="product-grid">
      {products.slice(0, 3).map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          inWishlist={wishlistIds.includes(product._id)}
        />
      ))}
    </div>
  </section>
)

export default FeaturedProducts
