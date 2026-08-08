import { useEffect, useState } from 'react'
import { fetchMyOrders, cancelOrderAPI } from '../services/orderService'
import { safePrice } from '../data/catalog'
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await fetchMyOrders()
        setOrders(data)
      } catch {
        setError('Failed to fetch your orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      setError('')
      const { data } = await cancelOrderAPI(orderId)
      setOrders((prev) => prev.map((ord) => (ord._id === orderId ? data : ord)))
      
      // Open the floating AI Chatbot and initiate the cancellation survey
      window.dispatchEvent(new CustomEvent('open-chatbot', {
        detail: {
          topic: 'cancel-reason-survey',
          orderId: orderId.substring(18)
        }
      }))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel the order. Please try again.')
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

  // Get active step index based on orderStatus
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending':
        return 0
      case 'Processing':
        return 1
      case 'Shipping':
        return 2
      case 'Completed':
        return 3
      case 'Cancelled':
        return -1
      default:
        return 0
    }
  }

  const steps = [
    { label: 'Placed', desc: 'Order received' },
    { label: 'Processed', desc: 'Packed & sorted' },
    { label: 'Shipped', desc: 'In transit' },
    { label: 'Delivered', desc: 'Handed over' }
  ]

  if (loading) {
    return (
      <section className="page-shell" style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--muted)' }}>Loading your orders...</p>
      </section>
    )
  }

  return (
    <section className="page-shell" style={{ maxWidth: '900px', margin: '0 auto 60px' }}>
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '8px' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--muted)' }}>Track shipping locations, estimated delivery dates, and status records.</p>
      </div>

      {error && <p className="error-text" style={{ color: '#ef4444', marginBottom: '24px' }}>{error}</p>}

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <FiPackage style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No orders found</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Looks like you haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {orders.map((order) => {
            const currentStep = getStatusStep(order.orderStatus)
            
            return (
              <div 
                key={order._id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-soft)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Header Summary */}
                <div 
                  style={{
                    padding: '20px 28px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-soft)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>Order ID</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)', marginTop: '2px' }}>#{order._id.substring(18)}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>Date Placed</span>
                      <span style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)', marginTop: '2px' }}>{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>Total Value</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)', marginTop: '2px' }}>{safePrice(order.totalPrice)}</strong>
                    </div>
                  </div>
                  <div>
                    {order.orderStatus === 'Completed' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.82rem', fontWeight: 700 }}>
                        <FiCheckCircle /> Completed
                      </span>
                    ) : order.orderStatus === 'Shipping' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.82rem', fontWeight: 700 }}>
                        <FiTruck /> Out for Delivery
                      </span>
                    ) : order.orderStatus === 'Cancelled' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.82rem', fontWeight: 700 }}>
                        Cancelled
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '0.82rem', fontWeight: 700 }}>
                          <FiClock /> {order.orderStatus}
                        </span>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#fef2f2',
                            color: '#b91c1c',
                            border: '1px solid #fca5a5',
                            borderRadius: '99px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Location & ETA Panel */}
                <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'center' }} className="order-tracking-info">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <FiMapPin style={{ fontSize: '1.2rem', color: 'var(--muted)', marginTop: '3px', shrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Current Location</span>
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text)', marginTop: '4px' }}>
                        {order.currentLocation || 'Noida Sorting Hub'}
                      </strong>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <FiCalendar style={{ fontSize: '1.2rem', color: 'var(--muted)', marginTop: '3px', shrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                        {order.orderStatus === 'Completed' ? 'Delivered On' : 'Estimated Delivery'}
                      </span>
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text)', marginTop: '4px' }}>
                        {order.orderStatus === 'Completed' ? formatDate(order.deliveredAt || order.updatedAt) : formatDate(order.estimatedDelivery)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Visual Progress Steps Tracker */}
                {order.orderStatus !== 'Cancelled' ? (
                  <div style={{ padding: '36px 28px', borderBottom: '1px solid var(--border)', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '90%', margin: '0 auto' }}>
                      {/* Connecting Progress Line */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '0',
                          right: '0',
                          height: '4px',
                          backgroundColor: '#e2e8f0',
                          zIndex: 1
                        }}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '0',
                          width: `${(currentStep / (steps.length - 1)) * 100}%`,
                          height: '4px',
                          backgroundColor: 'var(--accent)',
                          zIndex: 1,
                          transition: 'width 0.4s ease'
                        }}
                      />

                      {steps.map((step, idx) => {
                        const isActive = idx <= currentStep
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                            {/* Circle Dot */}
                            <div 
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isActive ? 'var(--accent)' : '#ffffff',
                                border: isActive ? 'none' : '3px solid #e2e8f0',
                                color: isActive ? '#ffffff' : 'var(--muted)',
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                boxShadow: isActive ? '0 4px 10px rgba(15, 23, 42, 0.2)' : 'none'
                              }}
                            >
                              {isActive ? '✓' : idx + 1}
                            </div>
                            {/* Labels */}
                            <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--text)' : 'var(--muted)', marginTop: '10px' }}>
                              {step.label}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '2px' }}>
                              {step.desc}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Itemized List */}
                <div style={{ padding: '24px 28px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: '14px' }}>Items Summary</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{item.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '2px' }}>Qty: {item.quantity} × {safePrice(item.price)}</span>
                        </div>
                        <strong style={{ color: 'var(--text)' }}>{safePrice(item.quantity * item.price)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default MyOrders
