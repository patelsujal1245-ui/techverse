import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'
import { createOrder } from '../services/orderService'
import { placeholderImage, safePrice } from '../data/catalog'

const Cart = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useContext(ShopContext)
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  })
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery')
  const [message, setMessage] = useState('')
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const submitHandler = async (event) => {
    event.preventDefault()
    if (!user?.token) {
      setMessage('Please login first to place an order.')
      navigate('/login')
      return
    }

    try {
      await createOrder({
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod,
        totalPrice: subtotal,
      })
      clearCart()
      setMessage('Order placed successfully. Check your profile for order history.')
    } catch {
      setMessage('Could not place the order. Make sure the backend is running and you are logged in.')
    }
  }

  if (!cart.length) {
    return (
      <section className="page-shell">
        <h1>Cart</h1>
        <p>Your cart is empty right now.</p>
        <Link to="/shop" className="text-link">
          Go shopping
        </Link>
      </section>
    )
  }

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Cart</h1>
        <p>Review items, update quantities, and place a simple checkout order.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article key={item._id} className="cart-item">
              <img
                src={item.images?.[0] || placeholderImage}
                alt={item.name}
                onError={(event) => {
                  event.currentTarget.src = placeholderImage
                }}
              />
              <div>
                <h3>{item.name}</h3>
                <p>{item.brand}</p>
                <p>{safePrice(item.price)}</p>
                <div className="quantity-row">
                  <button type="button" onClick={() => updateCartQuantity(item._id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateCartQuantity(item._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
              <button type="button" className="secondary" onClick={() => removeFromCart(item._id)}>
                Remove
              </button>
            </article>
          ))}
        </div>

        <form className="checkout-card" onSubmit={submitHandler}>
          <h2>Checkout</h2>
          <label>
            Address
            <input
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              required
            />
          </label>
          <label>
            City
            <input
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              required
            />
          </label>
          <label>
            Postal Code
            <input
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              required
            />
          </label>
          <label>
            Country
            <input
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              required
            />
          </label>
          <label>
            Payment Method
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Cash On Delivery</option>
              <option>UPI</option>
            </select>
          </label>
          <div className="summary-box">
            <p>Subtotal: {safePrice(subtotal)}</p>
            <p>Delivery: Free</p>
            <strong>Total: {safePrice(subtotal)}</strong>
          </div>
          {message ? <p className="success-text">{message}</p> : null}
          <button type="submit">Place Order</button>
        </form>
      </div>
    </section>
  )
}

export default Cart
