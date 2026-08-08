import { useEffect, useState, useMemo } from 'react'
import { fetchOrders, updateOrderStatusAPI } from '../../services/orderService'
import { safePrice } from '../../data/catalog'
import { FiClock, FiTruck, FiCheckCircle, FiSearch, FiEdit2, FiMapPin, FiCalendar } from 'react-icons/fi'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Search & Filter State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Edit State
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ orderStatus: 'Pending', currentLocation: '', estimatedDelivery: '' })

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await fetchOrders()
      setOrders(data)
    } catch {
      setError('Failed to load orders. Make sure you are authenticated as admin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const startEdit = (order) => {
    setEditingId(order._id)
    setEditForm({
      orderStatus: order.orderStatus,
      currentLocation: order.currentLocation || 'Noida Sorting Hub',
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().substring(0, 10) : ''
    })
  }

  const handleUpdate = async (orderId) => {
    try {
      setError('')
      setSuccess('')
      const { data } = await updateOrderStatusAPI(orderId, editForm)
      setOrders((prev) => prev.map((ord) => (ord._id === orderId ? data : ord)))
      setSuccess('Order updated successfully!')
      setEditingId(null)
      // Clear success alert after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to update order status. Please try again.')
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order as an Admin?')) return
    try {
      setError('')
      setSuccess('')
      const { data } = await updateOrderStatusAPI(orderId, { 
        orderStatus: 'Cancelled',
        currentLocation: 'Order Cancelled by Admin'
      })
      setOrders((prev) => prev.map((ord) => (ord._id === orderId ? data : ord)))
      setSuccess('Order cancelled successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to cancel order. Please try again.')
    }
  }

  // Filter and Search Memo
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        (order.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (order.user?.email || '').toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  // Count metrics for the filter buttons
  const counts = useMemo(() => {
    return {
      All: orders.length,
      Pending: orders.filter((o) => o.orderStatus === 'Pending').length,
      Processing: orders.filter((o) => o.orderStatus === 'Processing').length,
      Shipping: orders.filter((o) => o.orderStatus === 'Shipping').length,
      Completed: orders.filter((o) => o.orderStatus === 'Completed').length,
      Cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length
    }
  }, [orders])

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="page-shell" style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--muted)' }}>Loading system orders...</p>
      </section>
    )
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1100px', margin: '0 auto 60px' }}>
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '8px' }}>
          Manage System Orders
        </h1>
        <p style={{ color: 'var(--muted)' }}>Change delivery status, set tracking locations, and estimated delivery dates.</p>
      </div>

      {error && <div style={{ padding: '12px 18px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ padding: '12px 18px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem' }}>{success}</div>}

      {/* Search and Filters Controls */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}
        className="admin-orders-controls"
      >
        {/* Buttons Grid */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="admin-status-filters">
          <button 
            onClick={() => setStatusFilter('All')} 
            className={`admin-filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
            style={{
              padding: '10px 18px',
              borderRadius: '99px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: statusFilter === 'All' ? 'var(--accent)' : 'var(--bg-soft)',
              color: statusFilter === 'All' ? '#fff' : 'var(--text)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            All Orders ({counts.All})
          </button>
          
          <button 
            onClick={() => setStatusFilter('Pending')} 
            className={`admin-filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
            style={{
              padding: '10px 18px',
              borderRadius: '99px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: statusFilter === 'Pending' ? '#f59e0b' : 'var(--bg-soft)',
              color: statusFilter === 'Pending' ? '#fff' : 'var(--text)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Pending ({counts.Pending})
          </button>

          <button 
            onClick={() => setStatusFilter('Processing')} 
            className={`admin-filter-btn ${statusFilter === 'Processing' ? 'active' : ''}`}
            style={{
              padding: '10px 18px',
              borderRadius: '99px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: statusFilter === 'Processing' ? '#3b82f6' : 'var(--bg-soft)',
              color: statusFilter === 'Processing' ? '#fff' : 'var(--text)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Processing ({counts.Processing})
          </button>

          <button 
            onClick={() => setStatusFilter('Shipping')} 
            className={`admin-filter-btn ${statusFilter === 'Shipping' ? 'active' : ''}`}
            style={{
              padding: '10px 18px',
              borderRadius: '99px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: statusFilter === 'Shipping' ? '#0369a1' : 'var(--bg-soft)',
              color: statusFilter === 'Shipping' ? '#fff' : 'var(--text)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Shipping ({counts.Shipping})
          </button>

          <button 
            onClick={() => setStatusFilter('Completed')} 
            className={`admin-filter-btn ${statusFilter === 'Completed' ? 'active' : ''}`}
            style={{
              padding: '10px 18px',
              borderRadius: '99px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: statusFilter === 'Completed' ? '#10b981' : 'var(--bg-soft)',
              color: statusFilter === 'Completed' ? '#fff' : 'var(--text)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Completed ({counts.Completed})
          </button>

          <button 
            onClick={() => setStatusFilter('Cancelled')} 
            className={`admin-filter-btn ${statusFilter === 'Cancelled' ? 'active' : ''}`}
            style={{
              padding: '10px 18px',
              borderRadius: '99px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: statusFilter === 'Cancelled' ? '#ef4444' : 'var(--bg-soft)',
              color: statusFilter === 'Cancelled' ? '#fff' : 'var(--text)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancelled ({counts.Cancelled})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }} className="admin-search-wrapper">
          <FiSearch style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--muted)' }} />
          <input 
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or client email..."
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              outline: 'none',
              fontSize: '0.88rem',
              backgroundColor: 'var(--bg-soft)',
              color: 'var(--text)'
            }}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)' }}>
          <FiClock style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>No orders match this selection</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredOrders.map((order) => (
            <div 
              key={order._id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 32px',
                boxShadow: 'var(--shadow-soft)'
              }}
            >
              {/* Order Meta Header */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--text)' }}>Order #{order._id.substring(18)}</strong>
                  <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--muted)', marginTop: '4px' }}>
                    Client: <strong>{order.user?.name || 'Guest'}</strong> ({order.user?.email || 'N/A'})
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--text)', display: 'block' }}>{safePrice(order.totalPrice)}</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Placed: {formatDate(order.createdAt)}</span>
                </div>
              </div>

              {/* Order Items & Shipping details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginBottom: '20px' }} className="admin-order-body-grid">
                {/* Items column */}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Ordered Items</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text)' }}>
                        <span>{item.name} <strong style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>×{item.quantity}</strong></span>
                        <span>{safePrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '20px', marginBottom: '8px' }}>Address</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}
                  </span>
                </div>

                {/* Edit Form or Display status */}
                <div 
                  style={{
                    backgroundColor: 'var(--bg-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  {editingId === order._id ? (
                    <>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiEdit2 /> Update Tracker
                      </h4>

                       <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Status</label>
                        <select
                          value={editForm.orderStatus}
                          onChange={(e) => setEditForm({ ...editForm, orderStatus: e.target.value })}
                          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', background: '#fff', cursor: 'pointer' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipping">Shipping (Out for Delivery)</option>
                          <option value="Completed">Completed (Delivered)</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Current Location</label>
                        <input
                          type="text"
                          value={editForm.currentLocation}
                          onChange={(e) => setEditForm({ ...editForm, currentLocation: e.target.value })}
                          placeholder="e.g. Noida Sorting Facility"
                          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Est. Delivery Date</label>
                        <input
                          type="date"
                          value={editForm.estimatedDelivery}
                          onChange={(e) => setEditForm({ ...editForm, estimatedDelivery: e.target.value })}
                          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button 
                          onClick={() => handleUpdate(order._id)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: 'var(--accent)',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text)' }}>Shipping Details</strong>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button 
                            onClick={() => startEdit(order)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--accent)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FiEdit2 /> Update
                          </button>
                          
                          {order.orderStatus !== 'Completed' && order.orderStatus !== 'Cancelled' && (
                            <button 
                              onClick={() => handleCancelOrder(order._id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4.9px'
                              }}
                            >
                              ✕ Cancel
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiTruck style={{ color: 'var(--muted)' }} />
                          <span>Status: <strong style={{ color: 'var(--text)' }}>{order.orderStatus}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiMapPin style={{ color: 'var(--muted)' }} />
                          <span>Location: <strong style={{ color: 'var(--text)' }}>{order.currentLocation || 'Noida Sorting Hub'}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiCalendar style={{ color: 'var(--muted)' }} />
                          <span>
                            {order.orderStatus === 'Completed' ? 'Delivered: ' : 'ETA: '}
                            <strong style={{ color: 'var(--text)' }}>
                              {order.orderStatus === 'Completed' ? formatDate(order.deliveredAt || order.updatedAt) : formatDate(order.estimatedDelivery)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminOrders
