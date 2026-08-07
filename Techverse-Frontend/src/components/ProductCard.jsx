import { Link } from 'react-router-dom'
import { placeholderImage, safePrice } from '../data/catalog'
import { FiHeart } from 'react-icons/fi'

const ProductCard = ({ product, onAddToCart, onToggleWishlist, inWishlist }) => {
  const image = product.images?.[0] || placeholderImage

  return (
    <article className="product-card">
      <div style={{ position: 'relative' }}>
        <Link to={`/product/${product._id}`} className="product-media">
          <img
            src={image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = placeholderImage
            }}
          />
        </Link>
        <button
          type="button"
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={() => onToggleWishlist(product)}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart style={inWishlist ? { fill: '#ef4444', color: '#ef4444' } : {}} />
        </button>
      </div>

      <div className="product-meta">
        <span className="chip">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="brand-name">{product.brand}</p>
        <p className="product-description">{product.description}</p>
        <div className="price-row">
          <strong>{safePrice(product.price)}</strong>
          {product.oldPrice ? <span>{safePrice(product.oldPrice)}</span> : null}
        </div>
        <div className="card-actions">
          <button type="button" onClick={() => onAddToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

