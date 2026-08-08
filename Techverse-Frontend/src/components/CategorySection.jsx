import { Link } from 'react-router-dom'
import { 
  FiHeadphones, 
  FiWatch, 
  FiSmartphone, 
  FiMonitor, 
  FiCamera, 
  FiTablet, 
  FiCpu, 
  FiShoppingBag, 
  FiActivity, 
  FiLayers 
} from 'react-icons/fi'

const getCategoryIcon = (name) => {
  const norm = name.toLowerCase()
  if (norm.includes('audio')) return <FiHeadphones style={{ fontSize: '1.8rem', color: '#60a5fa' }} />
  if (norm.includes('wearable')) return <FiWatch style={{ fontSize: '1.8rem', color: '#34d399' }} />
  if (norm.includes('phone') || norm.includes('mobile')) return <FiSmartphone style={{ fontSize: '1.8rem', color: '#fbbf24' }} />
  if (norm.includes('laptop') || norm.includes('compute')) return <FiMonitor style={{ fontSize: '1.8rem', color: '#a78bfa' }} />
  if (norm.includes('camera')) return <FiCamera style={{ fontSize: '1.8rem', color: '#f472b6' }} />
  if (norm.includes('tablet')) return <FiTablet style={{ fontSize: '1.8rem', color: '#22d3ee' }} />
  if (norm.includes('gaming')) return <FiCpu style={{ fontSize: '1.8rem', color: '#f87171' }} />
  if (norm.includes('grocer') || norm.includes('food')) return <FiShoppingBag style={{ fontSize: '1.8rem', color: '#34d399' }} />
  if (norm.includes('daily') || norm.includes('usage') || norm.includes('personal') || norm.includes('care')) return <FiActivity style={{ fontSize: '1.8rem', color: '#818cf8' }} />
  return <FiLayers style={{ fontSize: '1.8rem', color: '#9ca3af' }} />
}

const CategorySection = ({ categories, theme = 'light' }) => {
  const isDark = theme === 'dark'

  return (
    <section className="category-section" style={{ padding: '60px 0', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)' }}>
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Categorized Catalog</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#ffffff' : 'var(--text)', marginBottom: '8px' }}>Shop by Category</h2>
        <p style={{ color: isDark ? '#cbd5e1' : 'var(--muted)', fontSize: '0.95rem' }}>Browse catalog inventory sorted by specialized product lines.</p>
      </div>
      
      <div 
        className="category-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', 
          gap: '20px' 
        }}
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/shop?category=${encodeURIComponent(category.name)}`}
            className="category-card"
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.4)' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '14px',
              textDecoration: 'none',
              boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.15)' : 'var(--shadow-soft)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer'
            }}
          >
            <div 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                backgroundColor: isDark ? '#1e293b' : 'var(--bg-soft)', 
                display: 'grid', 
                placeItems: 'center',
                transition: 'transform 0.3s ease'
              }}
              className="category-icon-wrapper"
            >
              {getCategoryIcon(category.name)}
            </div>
            <span 
              style={{ 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                color: isDark ? '#ffffff' : 'var(--text)' 
              }}
            >
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategorySection
