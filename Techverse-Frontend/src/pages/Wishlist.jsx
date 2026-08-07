import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { placeholderImage, safePrice } from '../data/catalog'
import { FiTrash2, FiShoppingCart } from 'react-icons/fi'

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(ShopContext)

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Wishlist</h1>
        <p>Save favorite products for later and move them to cart when you are ready.</p>
      </div>

      {!wishlist.length ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="hero-button">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <article key={item._id} className="wishlist-item">
              <img
                src={item.images?.[0] || placeholderImage}
                alt={item.name}
                onError={(event) => {
                  event.currentTarget.src = placeholderImage
                }}
              />
              <div>
                <h3>{item.name}</h3>
                <p className="brand-name">{item.brand}</p>
                <p className="price">{safePrice(item.price)}</p>
              </div>
              <div className="card-actions" style={{ marginLeft: 'auto', alignItems: 'center' }}>
                <button type="button" onClick={() => addToCart(item)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FiShoppingCart /> Add to cart
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeFromWishlist(item._id)}
                  title="Remove from wishlist"
                >
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist

