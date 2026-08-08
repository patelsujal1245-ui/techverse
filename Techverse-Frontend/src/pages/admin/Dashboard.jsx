import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminStats } from '../../services/adminService'
import { safePrice } from '../../data/catalog'
import { FiArrowRight } from 'react-icons/fi'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError('')
        const { data } = await fetchAdminStats()
        setStats(data)
      } catch {
        setError('Admin data could not be loaded. Check login and backend status.')
      }
    }

    loadDashboard()
  }, [])

  const chartMax = useMemo(() => {
    const monthly = stats?.monthlySales || []
    const categories = stats?.categoryBreakdown || []
    return Math.max(...monthly.map((item) => item.value), ...categories.map((item) => item.value), 1)
  }, [stats])

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Admin Dashboard</h1>
        <p>Track products, users, orders, and sales from one clean overview.</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '32px' }}>
        <article className="stat-card">
          <span>Products</span>
          <strong>{stats?.totals.products || 0}</strong>
        </article>
        <article className="stat-card">
          <span>Orders</span>
          <strong>{stats?.totals.orders || 0}</strong>
        </article>
        <article className="stat-card">
          <span>Revenue</span>
          <strong>{safePrice(stats?.totals.revenue || 0)}</strong>
        </article>
        <article className="stat-card">
          <span>Stock Left</span>
          <strong style={{ color: (stats?.totals.totalStock || 0) < 500 ? '#ef4444' : 'inherit' }}>
            {stats?.totals.totalStock || 0} units
          </strong>
        </article>
        <article className="stat-card">
          <span>Users</span>
          <strong>{stats?.totals.users || 0}</strong>
        </article>
      </div>

      {/* Financial Performance & Stock Capacity Analytics */}
      <div className="insight-grid" style={{ marginBottom: '32px' }}>
        <article className="insight-card">
          <div className="section-header compact">
            <h2>Profit & Loss Margin</h2>
            <p>Calculated active revenue splits (COGS, Net Profits, Cancellation Refunds)</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            {/* Visual Stacked Progress Bar */}
            <div 
              style={{
                width: '100%',
                height: '24px',
                borderRadius: '99px',
                overflow: 'hidden',
                display: 'flex',
                backgroundColor: '#e2e8f0',
                border: '1px solid var(--border)'
              }}
            >
              {stats?.totals.netProfit > 0 && (
                <div 
                  style={{
                    width: `${((stats.totals.netProfit) / (stats.totals.activeRevenue || 1)) * 100}%`,
                    backgroundColor: '#10b981',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                  title={`Net Profit: ${safePrice(stats.totals.netProfit)}`}
                >
                  {Math.round(((stats.totals.netProfit) / (stats.totals.activeRevenue || 1)) * 100)}%
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
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                  title={`COGS (Wholesale): ${safePrice(stats.totals.cogsValue)}`}
                >
                  65%
                </div>
              )}
              {stats?.totals.lossValue > 0 && (
                <div 
                  style={{
                    width: `${(stats.totals.lossValue / (stats.totals.revenue || 1)) * 100}%`,
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                  title={`Refund Losses: ${safePrice(stats.totals.lossValue)}`}
                >
                  Refunds
                </div>
              )}
            </div>

            {/* Labels and values */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }} className="financial-labels">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Net Profit: <strong>{safePrice(stats?.totals.netProfit || 0)}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#64748b' }} />
                <span>COGS Cost: <strong>{safePrice(stats?.totals.cogsValue || 0)}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span>Refunded Losses: <strong>{safePrice(stats?.totals.lossValue || 0)}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                <span>Active Rev: <strong>{safePrice(stats?.totals.activeRevenue || 0)}</strong></span>
              </div>
            </div>
          </div>
        </article>

        <article className="insight-card">
          <div className="section-header compact">
            <h2>Warehouse Stock Left</h2>
            <p>Product stock levels in the warehouse (Capacity threshold: 1,500 units)</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            {/* Visual Stock Level Bar */}
            <div style={{ width: '100%', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
              <div 
                style={{
                  width: `${Math.min(100, ((stats?.totals.totalStock || 0) / 1500) * 100)}%`,
                  height: '100%',
                  backgroundColor: (stats?.totals.totalStock || 0) < 500 ? '#f59e0b' : '#3b82f6',
                  transition: 'width 0.4s ease'
                }}
              />
              <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '0.78rem', fontWeight: 700, color: (stats?.totals.totalStock || 0) > 800 ? '#fff' : 'var(--text)' }}>
                {stats?.totals.totalStock || 0} / 1,500 Units Left
              </span>
            </div>
            
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.4' }}>
              {(stats?.totals.totalStock || 0) < 500 ? (
                <span style={{ color: '#d97706', fontWeight: 700 }}>⚠️ Alert: Warehouse levels are low. Please re-stock catalog products.</span>
              ) : (
                <span style={{ color: '#166534', fontWeight: 700 }}>✓ Safe: Warehouse levels are optimal. Standard delivery schedules active.</span>
              )}
            </div>
          </div>
        </article>
      </div>

      <div className="insight-grid">
        <article className="insight-card">
          <div className="section-header compact">
            <h2>Sales trend</h2>
            <p>Monthly order revenue</p>
          </div>
          <div className="bar-chart">
            {(stats?.monthlySales || []).map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(item.value / chartMax) * 100}%` }} />
                </div>
                <strong>{safePrice(item.value)}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="insight-card">
          <div className="section-header compact">
            <h2>User mix</h2>
            <p>Demographics in the app</p>
          </div>
          <div className="donut-card">
            <div className="donut-ring">
              <div className="donut-center">
                <strong>{stats?.demographics.admins || 0}</strong>
                <span>admins</span>
              </div>
            </div>
            <div className="mini-stats">
              <div>
                <span>Users</span>
                <strong>{stats?.demographics.users || 0}</strong>
              </div>
              <div>
                <span>Avg order</span>
                <strong>{safePrice(stats?.totals.averageOrderValue || 0)}</strong>
              </div>
              <div>
                <span>Pending</span>
                <strong>{stats?.totals.pendingOrders || 0}</strong>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="insight-grid">
        <article className="insight-card">
          <div className="section-header compact">
            <h2>Category split</h2>
            <p>Product distribution by section</p>
          </div>
          <div className="tag-list">
            {(stats?.categoryBreakdown || []).map((item) => (
              <div key={item.label} className="tag-chip">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="insight-card">
          <div className="section-header compact">
            <h2>Top products</h2>
            <p>Based on order quantity</p>
          </div>
          <div className="top-list">
            {(stats?.topProducts || []).map((item) => (
              <div key={item.name} className="top-row">
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.sold} sold</span>
                </div>
                <strong>{safePrice(item.revenue)}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="spaced-top" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/admin/products" className="hero-button">
          Manage Products <FiArrowRight style={{ marginLeft: 6 }} />
        </Link>
        <Link to="/admin/orders" className="hero-button outline" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
          Manage Orders <FiArrowRight style={{ marginLeft: 6 }} />
        </Link>
      </div>
    </section>
  )
}

export default Dashboard

