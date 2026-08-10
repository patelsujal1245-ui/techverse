import { useState } from 'react'
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

const getCategoryDetails = (name) => {
  const norm = name.toLowerCase()
  if (norm.includes('audio')) {
    return {
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#2563eb',
      desc: 'High Fidelity Sound',
      icon: <FiHeadphones style={{ fontSize: '1.8rem', color: '#2563eb' }} />
    }
  }
  if (norm.includes('wearable')) {
    return {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      text: '#059669',
      desc: 'Active Outdoor Gear',
      icon: <FiWatch style={{ fontSize: '1.8rem', color: '#059669' }} />
    }
  }
  if (norm.includes('phone') || norm.includes('mobile') || norm.includes('smart')) {
    return {
      bg: '#fffbeb',
      border: '#fef08a',
      text: '#d97706',
      desc: 'Next-Gen Cellular',
      icon: <FiSmartphone style={{ fontSize: '1.8rem', color: '#d97706' }} />
    }
  }
  if (norm.includes('laptop') || norm.includes('compute')) {
    return {
      bg: '#f5f3ff',
      border: '#ddd6fe',
      text: '#7c3aed',
      desc: 'Pro Workstations',
      icon: <FiMonitor style={{ fontSize: '1.8rem', color: '#7c3aed' }} />
    }
  }
  if (norm.includes('camera')) {
    return {
      bg: '#fff1f2',
      border: '#fecdd3',
      text: '#db2777',
      desc: 'Premium Capture',
      icon: <FiCamera style={{ fontSize: '1.8rem', color: '#db2777' }} />
    }
  }
  if (norm.includes('tablet')) {
    return {
      bg: '#ecfeff',
      border: '#cffafe',
      text: '#0891b2',
      desc: 'Drawing Slates',
      icon: <FiTablet style={{ fontSize: '1.8rem', color: '#0891b2' }} />
    }
  }
  if (norm.includes('gaming')) {
    return {
      bg: '#fef2f2',
      border: '#fca5a5',
      text: '#dc2626',
      desc: 'Pro Peripherals',
      icon: <FiCpu style={{ fontSize: '1.8rem', color: '#dc2626' }} />
    }
  }
  if (norm.includes('grocer') || norm.includes('food')) {
    return {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#166534',
      desc: 'Campus Groceries',
      icon: <FiShoppingBag style={{ fontSize: '1.8rem', color: '#166534' }} />
    }
  }
  if (norm.includes('daily') || norm.includes('usage') || norm.includes('personal')) {
    return {
      bg: '#f5f3ff',
      border: '#e0e7ff',
      text: '#4f46e5',
      desc: 'Everyday Essentials',
      icon: <FiActivity style={{ fontSize: '1.8rem', color: '#4f46e5' }} />
    }
  }
  return {
    bg: '#f8fafc',
    border: '#e2e8f0',
    text: '#475569',
    desc: 'Catalog Collections',
    icon: <FiLayers style={{ fontSize: '1.8rem', color: '#475569' }} />
  }
}

const CategorySection = ({ categories = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  return (
    <section className="category-section" style={{ padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
          Browse Catalog
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text)', margin: 0, letterSpacing: '-0.03em' }}>
          Shop by Category
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Explore high-performance gear filtered by product category.
        </p>
      </div>
      
      <div 
        className="category-grid" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '30px' 
        }}
      >
        {categories.map((category) => {
          const details = getCategoryDetails(category.name)
          const isHovered = hoveredCategory === category.name

          return (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                width: '130px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Circular Bubble Icon Wrap */}
              <div 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundColor: isHovered ? details.bg : '#ffffff', 
                  border: isHovered ? `1px solid ${details.border}` : '1px solid var(--border)',
                  display: 'grid', 
                  placeItems: 'center',
                  boxShadow: isHovered ? `0 10px 20px rgba(0,0,0,0.04)` : '0 4px 12px rgba(15, 23, 42, 0.02)',
                  transform: isHovered ? 'scale(1.1) translateY(-6px)' : 'scale(1) translateY(0px)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginBottom: '12px'
                }}
              >
                {details.icon}
              </div>

              {/* Title & Desc */}
              <span 
                style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 850, 
                  color: isHovered ? details.text : 'var(--text)',
                  transition: 'color 0.3s ease',
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                {category.name}
              </span>
              <span 
                style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--muted)',
                  marginTop: '2px',
                  textAlign: 'center',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}
              >
                {details.desc}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySection
