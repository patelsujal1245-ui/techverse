import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'
import { createOrder } from '../services/orderService'
import { placeholderImage, safePrice } from '../data/catalog'
import { FiPlus, FiMinus, FiTrash2, FiMapPin, FiCreditCard, FiCheckCircle, FiInfo, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'

const Cart = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useContext(ShopContext)
  
  // Multi-step state: 1 = Summary, 2 = Address, 3 = Payment, 4 = Success Receipt
  const [step, setStep] = useState(1)
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  })
  
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleNextToAddress = () => {
    if (!user?.token) {
      setMessage('Please login first to proceed to checkout.')
      navigate('/login')
      return
    }
    setStep(2)
  }

  const handleNextToPayment = (e) => {
    e.preventDefault()
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      setMessage('Please fill in all address details.')
      return
    }
    setMessage('')
    setStep(3)
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    if (!user?.token) {
      setMessage('Please login first to place an order.')
      navigate('/login')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { data } = await createOrder({
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
      
      setCreatedOrder(data)
      clearCart()
      setStep(4)
    } catch {
      setMessage('Could not place your order. Make sure the backend API is online.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Dynamic QR code API generator link
  const upiUrl = `upi://pay?pa=techverse@paytm&pn=Techverse%20Retail&am=${subtotal}&cu=INR`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`

  if (!cart.length && step < 4) {
    return (
      <section className="page-shell">
        <div className="empty-state">
          <FiShoppingBag style={{ fontSize: '3.5rem', color: 'var(--muted)', marginBottom: '16px' }} />
          <h1>Cart</h1>
          <p>Your shopping cart is currently empty.</p>
          <Link to="/shop" className="hero-button">
            Go Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1000px', margin: '0 auto 60px' }}>
      
      {/* Custom Flipkart Stepper */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '50px',
          flexWrap: 'wrap'
        }}
        className="checkout-stepper"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--accent)' : 'var(--border)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>1</span>
          <span style={{ fontSize: '0.88rem', fontWeight: step === 1 ? 700 : 500, color: step === 1 ? 'var(--text)' : 'var(--muted)' }}>Items Summary</span>
        </div>
        <div style={{ width: '40px', height: '2px', backgroundColor: step >= 2 ? 'var(--accent)' : 'var(--border)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--accent)' : 'var(--border)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>2</span>
          <span style={{ fontSize: '0.88rem', fontWeight: step === 2 ? 700 : 500, color: step === 2 ? 'var(--text)' : 'var(--muted)' }}>Delivery Address</span>
        </div>
        <div style={{ width: '40px', height: '2px', backgroundColor: step >= 3 ? 'var(--accent)' : 'var(--border)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 3 ? 'var(--accent)' : 'var(--border)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>3</span>
          <span style={{ fontSize: '0.88rem', fontWeight: step === 3 ? 700 : 500, color: step === 3 ? 'var(--text)' : 'var(--muted)' }}>Payment Info</span>
        </div>
        <div style={{ width: '40px', height: '2px', backgroundColor: step >= 4 ? 'var(--accent)' : 'var(--border)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 4 ? 'var(--accent)' : 'var(--border)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>4</span>
          <span style={{ fontSize: '0.88rem', fontWeight: step === 4 ? 700 : 500, color: step === 4 ? 'var(--text)' : 'var(--muted)' }}>Receipt Details</span>
        </div>
      </div>

      {message && <div style={{ padding: '12px 18px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem' }}>{message}</div>}

      <div className="cart-layout" style={{ gridTemplateColumns: step === 4 ? '1fr' : '1.2fr 0.8fr' }}>
        
        {/* LEFT COLUMN: ACTIVE STEP VIEW */}
        <div className="cart-left-section">
          
          {/* STEP 1: SUMMARY ITEMS LIST */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '20px' }}>Review Items</h2>
              <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item) => (
                  <article key={item._id} className="cart-item" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '20px', padding: '16px' }}>
                    <img
                      src={item.images?.[0] || placeholderImage}
                      alt={item.name}
                      style={{ width: '90px', height: '90px', objectFit: 'contain', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)' }}
                      onError={(event) => {
                        event.currentTarget.src = placeholderImage
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{item.name}</h3>
                      <p className="brand-name" style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>{item.brand}</p>
                      <p className="price" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>{safePrice(item.price)}</p>
                      
                      <div className="quantity-controls" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                        <button type="button" className="quantity-btn" onClick={() => updateCartQuantity(item._id, item.quantity - 1)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <FiMinus />
                        </button>
                        <span className="quantity-display" style={{ padding: '0 12px', fontSize: '0.88rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button type="button" className="quantity-btn" onClick={() => updateCartQuantity(item._id, item.quantity + 1)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    <button type="button" className="delete-btn" onClick={() => removeFromCart(item._id)} style={{ border: 'none', background: 'none', color: 'var(--muted)', cursor: 'pointer', height: 'fit-content' }} title="Remove item">
                      <FiTrash2 />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS DETAIL INPUTS */}
          {step === 2 && (
            <form onSubmit={handleNextToPayment} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Delivery Address</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Please specify where we should deliver your orders.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                  Street Address
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="e.g. Flat No, Street, Landmark"
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem' }}
                    required
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    City
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="e.g. Pune"
                      style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem' }}
                      required
                    />
                  </label>
                  
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    State
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="e.g. Maharashtra"
                      style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem' }}
                      required
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    Pincode / ZIP Code
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      placeholder="e.g. 411001"
                      style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem' }}
                      required
                    />
                  </label>
                  
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                    Country
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem', backgroundColor: 'var(--bg-soft)', color: 'var(--muted)', cursor: 'not-allowed' }}
                      disabled
                      required
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ padding: '12px 20px', border: '1px solid var(--border)', color: 'var(--text)', background: 'transparent', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiArrowLeft /> Back to Summary
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '12px 20px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}>
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD & UPI QR DECORATOR */}
          {step === 3 && (
            <form onSubmit={submitHandler} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Select Payment Method</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Choose your payment details to complete the order transaction.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                  Payment Option
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '0.9rem', background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="Cash On Delivery">Cash On Delivery (COD)</option>
                    <option value="UPI">UPI (Unified Payments Interface)</option>
                  </select>
                </label>

                {/* DYNAMIC QR CODE DISPLAY IF UPI SELECTED */}
                {paymentMethod === 'UPI' && (
                  <div 
                    style={{
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '16px'
                    }}
                    className="upi-qr-container"
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em' }}>Scan with GPay, Paytm, or PhonePe</span>
                    
                    {/* Simulated Scanner Border Box */}
                    <div 
                      style={{ 
                        background: '#ffffff', 
                        padding: '16px', 
                        borderRadius: 'var(--radius-md)', 
                        border: '3px solid var(--accent)', 
                        boxShadow: 'var(--shadow-soft)',
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={qrCodeUrl} 
                        alt="UPI Payment QR Code"
                        style={{ width: '180px', height: '180px', display: 'block' }}
                      />
                    </div>

                    <strong style={{ fontSize: '1.2rem', color: 'var(--text)' }}>
                      Total Amount: {safePrice(subtotal)}
                    </strong>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', maxWidth: '400px', fontSize: '0.78rem', color: '#166534', textAlign: 'left' }}>
                      <FiInfo style={{ shrink: 0, marginTop: '2px' }} />
                      <span><strong>Sandbox Check:</strong> Scanning is purely simulated for UI design. There is no actual charge; click the checkout button below to finalize your order.</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setStep(2)} style={{ padding: '12px 20px', border: '1px solid var(--border)', color: 'var(--text)', background: 'transparent', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiArrowLeft /> Back to Address
                  </button>
                  <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px 20px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? 'Processing...' : `Place Order (${safePrice(subtotal)})`}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: ORDER CONFIRMED SUCCESS RECEIPT */}
          {step === 4 && createdOrder && (
            <div 
              style={{ 
                background: '#fff', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-xl)', 
                padding: '48px 40px', 
                textAlign: 'center', 
                boxShadow: 'var(--shadow-soft)' 
              }}
              className="checkout-receipt-card"
            >
              <FiCheckCircle style={{ fontSize: '4.5rem', color: '#10b981', marginBottom: '20px' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '8px' }}>Order Confirmed!</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.98rem', marginBottom: '32px' }}>
                Your order has been recorded successfully. A receipt will arrive via your verified email.
              </p>

              {/* Receipt Summary Details */}
              <div 
                style={{ 
                  background: 'var(--bg-soft)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '24px', 
                  maxWidth: '550px', 
                  margin: '0 auto 36px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Order Reference</span>
                  <strong style={{ color: 'var(--text)' }}>#{createdOrder._id.substring(18)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Estimated Delivery</span>
                  <strong style={{ color: 'var(--text)' }}>{formatDate(createdOrder.estimatedDelivery)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Delivery Hub</span>
                  <strong style={{ color: 'var(--text)' }}>{createdOrder.currentLocation || 'Noida Sorting Hub'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Payment Mode</span>
                  <strong style={{ color: 'var(--text)' }}>{createdOrder.paymentMethod}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>Total Charge</span>
                  <strong style={{ color: 'var(--text)', fontWeight: 800 }}>{safePrice(createdOrder.totalPrice)}</strong>
                </div>
              </div>

              {/* Navigation Action row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }} className="receipt-actions">
                <Link to="/my-orders" className="hero-button" style={{ textDecoration: 'none' }}>
                  Track Order Location
                </Link>
                <Link to="/shop" className="hero-button outline" style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY CARD (HIDDEN ON SUCCESS RECEIPT) */}
        {step < 4 && (
          <div className="cart-sidebar">
            <div className="checkout-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>Price Summary</h3>
              
              <div className="summary-box" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--muted)' }}>
                  <span>Subtotal</span>
                  <span>{safePrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--muted)' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <span>Total Payable</span>
                  <span>{safePrice(subtotal)}</span>
                </div>
              </div>
              
              {step === 1 && (
                <button 
                  onClick={handleNextToAddress} 
                  style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', marginTop: '20px' }}
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

export default Cart
