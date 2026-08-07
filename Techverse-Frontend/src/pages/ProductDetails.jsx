import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ShopContext } from '../context/ShopContext'
import { fallbackProducts, normalizeProduct, placeholderImage, safePrice } from '../data/catalog'
import { fetchProduct, fetchProducts } from '../services/productService'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])

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
            .slice(0, 3),
        )
      } catch {
        const fallbackProduct = fallbackProducts.find((item) => item._id === id) || fallbackProducts[0]
        setProduct(fallbackProduct)
        setRelated(fallbackProducts.filter((item) => item._id !== fallbackProduct._id).slice(0, 3))
      }
    }

    loadProduct()
  }, [id])

  if (!product) {
    return (
      <section className="page-shell">
        <p>Loading product details...</p>
      </section>
    )
  }

  const inWishlist = wishlist.some((item) => item._id === product._id)

  return (
    <section className="page-shell">
      <div className="product-detail">
        <div className="product-detail-media">
          <img
            src={product.images?.[0] || placeholderImage}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = placeholderImage
            }}
          />
        </div>
        <div className="product-detail-content">
          <span className="chip">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="muted">{product.brand}</p>
          <p>{product.description}</p>
          <div className="price-row">
            <strong>{safePrice(product.price)}</strong>
            {product.oldPrice ? <span>{safePrice(product.oldPrice)}</span> : null}
          </div>
          <p>Stock left: {product.stock}</p>
          <div className="card-actions">
            <button type="button" onClick={() => addToCart(product)}>
              Add to cart
            </button>
            <button type="button" className="secondary" onClick={() => toggleWishlist(product)}>
              {inWishlist ? 'Saved to wishlist' : 'Add to wishlist'}
            </button>
          </div>
          {product.specifications ? (
            <div className="spec-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span>{key}</span>
                  <strong>{String(value)}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="section-header spaced-top">
        <h2>Related Products</h2>
        <p>More items from the same catalog.</p>
      </div>
      <div className="product-grid">
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
      <div className="spaced-top">
        <Link to="/shop" className="text-link">
          Back to shop
        </Link>
      </div>
    </section>
  )
}

export default ProductDetails
