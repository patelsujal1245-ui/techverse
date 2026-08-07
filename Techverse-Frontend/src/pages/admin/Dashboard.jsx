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

      <div className="stats-grid">
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
          <span>Users</span>
          <strong>{stats?.totals.users || 0}</strong>
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

      <div className="spaced-top">
        <Link to="/admin/products" className="hero-button">
          Manage Products <FiArrowRight style={{ marginLeft: 6 }} />
        </Link>
      </div>
    </section>
  )
}

export default Dashboard

