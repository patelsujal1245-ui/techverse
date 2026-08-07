import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { placeholderImage, safePrice } from '../data/catalog'

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(ShopContext)

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Wishlist</h1>
        <p>Save favorite products for later and move them to cart when you are ready.</p>
      </div>

      {!wishlist.length ? (
        <>
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="text-link">
            Browse products
          </Link>
        </>
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
                <p>{safePrice(item.price)}</p>
                <div className="card-actions">
                  <button type="button" onClick={() => addToCart(item)}>
                    Add to cart
                  </button>
                  <button type="button" className="secondary" onClick={() => removeFromWishlist(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist
