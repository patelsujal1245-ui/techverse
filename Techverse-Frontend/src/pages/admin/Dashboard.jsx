import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminStats, fetchWarehouseLogs } from '../../services/adminService'
import { fetchProducts, updateProduct } from '../../services/productService'
import { fetchOrders } from '../../services/orderService'
import { safePrice, placeholderImage } from '../../data/catalog'
import { 
  FiArrowRight, 
  FiGrid, 
  FiPackage, 
  FiDollarSign, 
  FiDatabase, 
  FiSearch, 
  FiCheck, 
  FiX, 
  FiAlertTriangle, 
  FiClock,
  FiShoppingBag,
  FiUser
} from 'react-icons/fi'

const Dashboard = () => {
  // Navigation Tabs: 'overview', 'financials', 'stocks', 'warehouse'
  const [activeTab, setActiveTab] = useState('overview')
  
  // Data States
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  
  // Loading & Error States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Search & Filter States
  const [productSearch, setProductSearch] = useState('')
  const [productFilter, setProductFilter] = useState('all') // 'all', 'low', 'out'
  const [editingProductId, setEditingProductId] = useState(null)
  const [editingStockVal, setEditingStockVal] = useState('')
  const [updatingStockId, setUpdatingStockId] = useState(null)

  // Fetch all data
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [statsRes, logsRes, productsRes, ordersRes] = await Promise.all([
        fetchAdminStats(),
        fetchWarehouseLogs(),
        fetchProducts(),
        fetchOrders()
      ])
      
      setStats(statsRes.data)
      setLogs(logsRes.data || [])
      setProducts(productsRes.data || [])
      setOrders(ordersRes.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load dashboard metrics. Check backend status and admin login session.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Handle inline stock update
  const handleStockUpdate = async (productId) => {
    if (editingStockVal === '' || isNaN(editingStockVal)) {
      alert('Please enter a valid stock number.')
      return
    }
    
    try {
      setUpdatingStockId(productId)
      const stockNum = Math.max(0, parseInt(editingStockVal, 10))
      
      // Call update API
      await updateProduct(productId, { stock: stockNum })
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === productId ? { ...p, stock: stockNum } : p)
      )
      
      // Reload logs to see the Admin Adjustment record immediately
      const logsRes = await fetchWarehouseLogs()
      setLogs(logsRes.data || [])
      
      // Also reload stats to update "Stock Left" metrics
      const statsRes = await fetchAdminStats()
      setStats(statsRes.data)
      
      setEditingProductId(null)
      setEditingStockVal('')
    } catch (err) {
      alert('Failed to update product stock level. Please try again.')
    } finally {
      setUpdatingStockId(null)
    }
  }

  // Memoized Chart calculations
  const chartMax = useMemo(() => {
    const monthly = stats?.monthlySales || []
    const categories = stats?.categoryBreakdown || []
    return Math.max(...monthly.map((item) => item.value), ...categories.map((item) => item.value), 1)
  }, [stats])

  // Filtered Products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(productSearch.toLowerCase())
      
      if (productFilter === 'low') {
        return matchesSearch && product.stock > 0 && product.stock <= 5
      }
      if (productFilter === 'out') {
        return matchesSearch && product.stock <= 0
      }
      return matchesSearch
    })
  }, [products, productSearch, productFilter])

  // Formatting date helper
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabItemStyle = (tabId) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    borderRadius: 'var(--radius-md)',
    color: activeTab === tabId ? '#ffffff' : 'var(--text)',
    backgroundColor: activeTab === tabId ? 'var(--accent)' : 'transparent',
    fontWeight: 700,
    fontSize: '0.92rem',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    marginBottom: '6px'
  })

  if (loading && !stats) {
    return (
      <section className="page-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading Professional Dashboard...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1400px', margin: '0 auto 60px' }}>
      
      {/* Top Professional Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid var(--border)', 
          paddingBottom: '20px', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em' }}>
            System Administration
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 850, letterSpacing: '-0.02em', color: 'var(--text)', margin: '4px 0 0 0' }}>
            Operations & Control Panel
          </h1>
        </div>
        
        {/* Quick actions/Stats refresh */}
        <button 
          onClick={loadDashboardData}
          style={{
            padding: '10px 18px',
            backgroundColor: 'var(--bg-soft)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Refresh Live Metrics
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 18px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Main Grid: Left Sidebar Tabs / Right Dynamic Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <aside 
          style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '16px', 
            boxShadow: 'var(--shadow-soft)',
            position: 'sticky',
            top: '100px'
          }}
        >
          <div style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Main Console Menu
          </div>
          
          <nav>
            <button onClick={() => setActiveTab('overview')} style={tabItemStyle('overview')}>
              <FiGrid style={{ fontSize: '1.1rem' }} /> Overview & Activity
            </button>
            <button onClick={() => setActiveTab('financials')} style={tabItemStyle('financials')}>
              <FiDollarSign style={{ fontSize: '1.1rem' }} /> Profit & Margins
            </button>
            <button onClick={() => setActiveTab('stocks')} style={tabItemStyle('stocks')}>
              <FiPackage style={{ fontSize: '1.1rem' }} /> Stocks & Inventory
            </button>
            <button onClick={() => setActiveTab('warehouse')} style={tabItemStyle('warehouse')}>
              <FiDatabase style={{ fontSize: '1.1rem' }} /> Warehouse Ledger
            </button>
          </nav>
          
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '16px' }}>
            <div style={{ padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Sub-Modules
            </div>
            <Link 
              to="/admin/products" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}
            >
              Manage Products <FiArrowRight style={{ marginLeft: 'auto', fontSize: '0.85rem' }} />
            </Link>
            <Link 
              to="/admin/orders" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}
            >
              Manage Orders <FiArrowRight style={{ marginLeft: 'auto', fontSize: '0.85rem' }} />
            </Link>
          </div>
        </aside>

        {/* RIGHT COLUMN: Active Tab View Container */}
        <main 
          style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '30px', 
            boxShadow: 'var(--shadow-soft)',
            minHeight: '600px'
          }}
        >

          {/* TAB 1: OVERVIEW & GENERAL ACTIVITY */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Overview & Activity</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>General performance status, monthly trends, and product highlights.</p>
              
              {/* Summary Stats Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px', backgroundColor: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '6px' }}>Total Catalog</span>
                  <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{stats?.totals.products || 0} products</strong>
                </article>
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px', backgroundColor: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '6px' }}>Active Revenue</span>
                  <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{safePrice(stats?.totals.activeRevenue || 0)}</strong>
                </article>
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px', backgroundColor: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '6px' }}>Total Warehouse Stock</span>
                  <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: (stats?.totals.totalStock || 0) < 500 ? '#dc2626' : 'var(--text)' }}>{stats?.totals.totalStock || 0} units</strong>
                </article>
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px', backgroundColor: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '6px' }}>Pending Orders</span>
                  <strong style={{ fontSize: '1.8rem', fontWeight: 800, color: (stats?.totals.pendingOrders || 0) > 0 ? '#d97706' : 'var(--text)' }}>{stats?.totals.pendingOrders || 0} orders</strong>
                </article>
              </div>

              {/* Grid: Charts and Lists */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                {/* Sales Trend Bar Chart */}
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Sales Trend</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '16px' }}>Monthly order revenue distributions.</p>
                  
                  <div className="bar-chart" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(stats?.monthlySales || []).map((item) => (
                      <div key={item.label} className="bar-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600 }}>{item.label}</span>
                        <div className="bar-track" style={{ flex: 1, height: '14px', backgroundColor: 'var(--bg-soft)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div className="bar-fill" style={{ width: `${(item.value / chartMax) * 100}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: '99px' }} />
                        </div>
                        <strong style={{ width: '90px', textRight: 'right', fontSize: '0.85rem' }}>{safePrice(item.value)}</strong>
                      </div>
                    ))}
                  </div>
                </article>

                {/* Top Selling Products */}
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Top Selling Products</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '16px' }}>Based on order volume.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(stats?.topProducts || []).map((item, idx) => (
                      <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: idx < (stats?.topProducts?.length - 1) ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ maxWidth: '70%' }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>{item.sold} sold</span>
                        </div>
                        <strong style={{ fontSize: '0.88rem' }}>{safePrice(item.revenue)}</strong>
                      </div>
                    ))}
                    {(!stats?.topProducts || stats.topProducts.length === 0) && (
                      <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', padding: '20px' }}>No sales data available yet.</div>
                    )}
                  </div>
                </article>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Category Split */}
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Category Breakdown</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '16px' }}>Total products registered per catalog category.</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(stats?.categoryBreakdown || []).map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '99px', backgroundColor: 'var(--bg-soft)', fontSize: '0.8rem', fontWeight: 700 }}>
                        <span style={{ color: 'var(--muted)' }}>{item.label}:</span>
                        <strong style={{ color: 'var(--text)' }}>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>

                {/* User demographics */}
                <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Admin & User mix</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '16px' }}>System accounts distribution statistics.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '4px' }}>Total Customers</span>
                      <strong style={{ fontSize: '1.4rem', color: 'var(--text)', fontWeight: 800 }}>{stats?.demographics.users || 0}</strong>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '4px' }}>Administrators</span>
                      <strong style={{ fontSize: '1.4rem', color: 'var(--text)', fontWeight: 800 }}>{stats?.demographics.admins || 0}</strong>
                    </div>
                  </div>
                </article>
              </div>

            </div>
          )}

          {/* TAB 2: FINANCIAL MARGINS & PROFITABILITY LEDGER */}
          {activeTab === 'financials' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Profit & Margins</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Track profitability, product margins, and transaction details.</p>

              {/* Stacked Progress Bar */}
              <article style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>Visual Revenue Splits</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ width: '100%', height: '28px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border)' }}>
                    {stats?.totals.netProfit > 0 && (
                      <div 
                        style={{
                          width: `${((stats.totals.netProfit) / (stats.totals.activeRevenue || 1)) * 100}%`,
                          backgroundColor: '#10b981',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 850
                        }}
                      >
                        Net Profit ({Math.round(((stats.totals.netProfit) / (stats.totals.activeRevenue || 1)) * 100)}%)
                      </div>
                    )}
                    {stats?.totals.cogsValue > 0 && (
                      <div 
                        style={{
                          width: `${(stats.totals.cogsValue / (stats.totals.activeRevenue || 1)) * 100}%`,
                          backgroundColor: '#64748b',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 850
                        }}
                      >
                        COGS (65%)
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      <span>Net Profit: <strong>{safePrice(stats?.totals.netProfit || 0)}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#64748b' }} />
                      <span>Wholesale Cost (COGS): <strong>{safePrice(stats?.totals.cogsValue || 0)}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                      <span>Refunded / Cancelled Loss: <strong>{safePrice(stats?.totals.lossValue || 0)}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                      <span>Active Revenue: <strong>{safePrice(stats?.totals.activeRevenue || 0)}</strong></span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Informative alert box explaining calculation model */}
              <div style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', marginBottom: '30px', fontSize: '0.85rem', color: '#1e3a8a' }}>
                <FiAlertTriangle style={{ flexShrink: 0, marginTop: '2px', color: '#3b82f6', fontSize: '1.1rem' }} />
                <div>
                  <strong>Financial Margin Calculation Model:</strong>
                  <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                    <li><strong>Active Revenue</strong> represents net sales from all orders that have not been cancelled.</li>
                    <li><strong>Cost of Goods Sold (COGS)</strong> is modeled at a standardized wholesale value of 65% of order retail prices.</li>
                    <li><strong>Net Profit</strong> is the remaining 35% margin on non-cancelled orders.</li>
                    <li><strong>Refunded Loss</strong> tracks potential revenue lost from orders cancelled by admins or customers.</li>
                  </ul>
                </div>
              </div>

              {/* Order-level margins list */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '16px' }}>Recent Transaction Margins</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--muted)', fontWeight: 800 }}>
                      <th style={{ padding: '12px 10px' }}>Order ID</th>
                      <th style={{ padding: '12px 10px' }}>Date</th>
                      <th style={{ padding: '12px 10px' }}>Mode</th>
                      <th style={{ padding: '12px 10px' }}>Total Price</th>
                      <th style={{ padding: '12px 10px' }}>COGS (65%)</th>
                      <th style={{ padding: '12px 10px' }}>Net Profit (35%)</th>
                      <th style={{ padding: '12px 10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => {
                      const isCancelled = order.orderStatus === 'Cancelled'
                      const cogs = isCancelled ? 0 : order.totalPrice * 0.65
                      const profit = isCancelled ? 0 : order.totalPrice * 0.35
                      
                      return (
                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', color: isCancelled ? 'var(--muted)' : 'inherit' }}>
                          <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontWeight: 700 }}>
                            #{order._id.substring(18)}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            {formatDateTime(order.createdAt)}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{ 
                              padding: '2px 6px', 
                              borderRadius: '3px', 
                              backgroundColor: order.paymentMethod === 'UPI' ? '#e0e7ff' : '#f1f5f9', 
                              color: order.paymentMethod === 'UPI' ? '#3730a3' : '#475569',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                            {safePrice(order.totalPrice)}
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--muted)' }}>
                            {safePrice(cogs)}
                          </td>
                          <td style={{ padding: '12px 10px', color: isCancelled ? 'var(--muted)' : '#10b981', fontWeight: isCancelled ? 500 : 700 }}>
                            {isCancelled ? safePrice(0) : safePrice(profit)}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: isCancelled ? '#ef4444' : (order.orderStatus === 'Completed' ? '#10b981' : '#f59e0b')
                            }}>
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                          No orders registered in the system yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: STOCKS INVENTORY CATALOG (WITH INLINE RESTOCK ACTIONS) */}
          {activeTab === 'stocks' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Stocks & Inventory</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Live warehouse stock counts. Click stock levels to adjust numbers immediately.</p>

              {/* Filtering Controls */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--muted)' }} />
                  <input
                    type="search"
                    placeholder="Search product stock by name or brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      outline: 'none',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setProductFilter('all')}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: productFilter === 'all' ? 'var(--accent)' : 'var(--bg-soft)',
                      color: productFilter === 'all' ? '#fff' : 'var(--text)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    All Products
                  </button>
                  <button 
                    onClick={() => setProductFilter('low')}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: productFilter === 'low' ? '#f59e0b' : 'var(--bg-soft)',
                      color: productFilter === 'low' ? '#fff' : 'var(--text)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Low Stock (≤ 5)
                  </button>
                  <button 
                    onClick={() => setProductFilter('out')}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: productFilter === 'out' ? '#ef4444' : 'var(--bg-soft)',
                      color: productFilter === 'out' ? '#fff' : 'var(--text)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Out of Stock
                  </button>
                </div>
              </div>

              {/* Stocks Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--muted)', fontWeight: 800 }}>
                      <th style={{ padding: '12px 10px', width: '70px' }}>Image</th>
                      <th style={{ padding: '12px 10px' }}>Product Details</th>
                      <th style={{ padding: '12px 10px' }}>Category</th>
                      <th style={{ padding: '12px 10px' }}>Price</th>
                      <th style={{ padding: '12px 10px', width: '220px' }}>Available Stock</th>
                      <th style={{ padding: '12px 10px' }}>Availability Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const isLow = product.stock > 0 && product.stock <= 5
                      const isOut = product.stock <= 0
                      const isEditing = editingProductId === product._id
                      
                      return (
                        <tr key={product._id} style={{ borderBottom: '1px solid var(--border)', height: '70px' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <img 
                              src={product.images?.[0] || placeholderImage} 
                              alt="" 
                              style={{ width: '45px', height: '45px', objectFit: 'contain', background: 'var(--bg-soft)', borderRadius: '4px' }}
                              onError={(e) => { e.currentTarget.src = placeholderImage }}
                            />
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <strong style={{ display: 'block', color: 'var(--text)', fontSize: '0.9rem' }}>{product.name}</strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Brand: {product.brand}</span>
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--muted)' }}>
                            {product.category}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                            {safePrice(product.price)}
                          </td>
                          
                          {/* STOCK COUNT & QUICK RESTOCK CONTROLLER */}
                          <td style={{ padding: '12px 10px' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                  type="number"
                                  value={editingStockVal}
                                  onChange={(e) => setEditingStockVal(e.target.value)}
                                  placeholder="Qty"
                                  min="0"
                                  autoFocus
                                  style={{
                                    width: '70px',
                                    padding: '5px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--accent)',
                                    outline: 'none',
                                    fontSize: '0.85rem'
                                  }}
                                />
                                <button 
                                  onClick={() => handleStockUpdate(product._id)}
                                  disabled={updatingStockId === product._id}
                                  style={{
                                    padding: '6px',
                                    backgroundColor: '#10b981',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <FiCheck />
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingProductId(null)
                                    setEditingStockVal('')
                                  }}
                                  style={{
                                    padding: '6px',
                                    backgroundColor: '#ef4444',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <FiX />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setEditingProductId(product._id)
                                  setEditingStockVal(product.stock)
                                }}
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  padding: '4px 10px',
                                  backgroundColor: 'var(--bg-soft)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontWeight: 800,
                                  fontSize: '0.85rem'
                                }}
                                title="Click to adjust stock count"
                              >
                                <span>{product.stock} units</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 500 }}>(Adjust)</span>
                              </div>
                            )}
                          </td>
                          
                          {/* AVAILABILITY STATE STATUS CHIP */}
                          <td style={{ padding: '12px 10px' }}>
                            {isOut ? (
                              <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.75rem', fontWeight: 800 }}>
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#fffbeb', border: '1px solid #fde047', color: '#b45309', fontSize: '0.75rem', fontWeight: 800 }}>
                                Low Stock Warning
                              </span>
                            ) : (
                              <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.75rem', fontWeight: 800 }}>
                                Adequate Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                          No products found matching these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: WAREHOUSE STOCK LEDGER / HISTORICAL TRANSACTION LOG */}
          {activeTab === 'warehouse' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Warehouse Ledger</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Historical ledger tracing stock decrements from customer purchases and increases from admin updates/cancellations.</p>

              {/* Warehouse summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Ledger Logs</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--text)', fontWeight: 800 }}>{logs.length} operations</strong>
                </div>
                <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Sales Transactions</span>
                  <strong style={{ fontSize: '1.5rem', color: '#b91c1c', fontWeight: 800 }}>
                    {logs.filter(l => l.changeType === 'Sale').length} entries
                  </strong>
                </div>
                <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-soft)' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Inventory Adjustments</span>
                  <strong style={{ fontSize: '1.5rem', color: '#166534', fontWeight: 800 }}>
                    {logs.filter(l => l.changeType === 'Admin Adjustment' || l.changeType === 'Cancellation').length} entries
                  </strong>
                </div>
              </div>

              {/* Ledger Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--muted)', fontWeight: 800 }}>
                      <th style={{ padding: '12px 10px' }}>Date & Time</th>
                      <th style={{ padding: '12px 10px' }}>Product details</th>
                      <th style={{ padding: '12px 10px' }}>Adjust Type</th>
                      <th style={{ padding: '12px 10px', textRight: 'right' }}>Adjustment Qty</th>
                      <th style={{ padding: '12px 10px' }}>Leftover Ledger (Old ➜ New)</th>
                      <th style={{ padding: '12px 10px' }}>Notes / Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const isNegative = log.quantityChanged < 0
                      
                      return (
                        <tr key={log._id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 10px', color: 'var(--muted)' }}>
                            {formatDateTime(log.createdAt)}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <strong style={{ display: 'block', color: 'var(--text)' }}>
                              {log.productName}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                              ID: {log.product?._id || log.product}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '3px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: log.changeType === 'Sale' ? '#fee2e2' : (log.changeType === 'Cancellation' ? '#dcfce7' : '#fef3c7'),
                              color: log.changeType === 'Sale' ? '#991b1b' : (log.changeType === 'Cancellation' ? '#166534' : '#92400e'),
                              textTransform: 'uppercase'
                            }}>
                              {log.changeType}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', color: isNegative ? '#b91c1c' : '#166534', fontWeight: 800, textRight: 'right' }}>
                            {isNegative ? '' : '+'}{log.quantityChanged}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                            {log.oldStock} left ➜ <strong>{log.newStock} leftover</strong>
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--muted)', fontSize: '0.8rem' }}>
                            {log.details || 'System action'}
                          </td>
                        </tr>
                      )
                    })}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                          Warehouse Ledger is currently empty. Place orders or modify stocks to register transaction logs.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </main>
      </div>

    </section>
  )
}

export default Dashboard
