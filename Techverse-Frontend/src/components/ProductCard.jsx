import { Link } from 'react-router-dom'
import { placeholderImage, safePrice } from '../data/catalog'

const ProductCard = ({ product, onAddToCart, onToggleWishlist, inWishlist }) => {
  const image = product.images?.[0] || placeholderImage

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-media">
        <img
          src={image}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = placeholderImage
          }}
        />
      </Link>
      <div className="product-meta">
        <span className="chip">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.brand}</p>
        <p className="product-description">{product.description}</p>
        <div className="price-row">
          <strong>{safePrice(product.price)}</strong>
          {product.oldPrice ? <span>{safePrice(product.oldPrice)}</span> : null}
        </div>
        <div className="card-actions">
          <button type="button" onClick={() => onAddToCart(product)}>
            Add to cart
          </button>
          <button type="button" className="secondary" onClick={() => onToggleWishlist(product)}>
            {inWishlist ? 'Saved' : 'Wishlist'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
