import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { placeholderImage } from '../data/catalog'

const Hero = ({ products = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef(null)

  // Map backend products dynamically to campaign slides with premium accents
  const campaignSlides = useMemo(() => {
    if (!products || products.length === 0) return []
    
    return products.slice(0, 6).map((product, index) => {
      const themes = [
        { accent: '#2563eb', text: '#1e3a8a' },
        { accent: '#7c3aed', text: '#4c1d95' },
        { accent: '#db2777', text: '#701a75' },
        { accent: '#e11d48', text: '#881337' },
        { accent: '#0284c7', text: '#0c4a6e' },
        { accent: '#059669', text: '#064e3b' }
      ]
      
      const theme = themes[index % themes.length]

      return {
        id: product._id,
        accentColor: theme.accent,
        textColor: theme.text,
        eyebrow: `Trending in ${product.category}`,
        title: product.name,
        sub: product.description,
        ctaText: 'View Details',
        ctaLink: `/product/${product._id}`,
        secondaryText: 'Shop Category',
        secondaryLink: `/shop?category=${encodeURIComponent(product.category)}`,
        metrics: [
          { value: product.brand, label: 'Manufacturer' },
          { value: product.rating ? `${product.rating.toFixed(1)} ★` : '4.5 ★', label: 'User Rating' },
          { value: product.stock > 0 ? `${product.stock} Left` : 'Out of Stock', label: 'Stock Level' }
        ],
        image: product.images?.[0] || placeholderImage,
        featuredLabel: product.category,
        featuredTitle: product.name
      }
    })
  }, [products])

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === campaignSlides.length - 1 ? 0 : prev + 1))
  }, [campaignSlides])

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? campaignSlides.length - 1 : prev - 1))
  }, [campaignSlides])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    if (campaignSlides.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext()
      }, 7000)
    }
  }, [handleNext, stopTimer, campaignSlides])

  useEffect(() => {
    startTimer()
    return () => stopTimer()
  }, [startTimer, stopTimer])

  if (campaignSlides.length === 0) {
    return (
      <div style={{ height: '360px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-xl)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)', margin: '40px 0' }}>
        <p style={{ color: 'var(--muted)' }}>Loading promotional spotlight...</p>
      </div>
    )
  }

  const currentCampaign = campaignSlides[currentSlide]

  return (
    <section 
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      style={{
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-soft)',
        margin: '20px 0 56px',
        border: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Background Image (High-Resolution Minimalist Tech Desk Setup) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />

      {/* Frosted Glass Overlay (Blends image softly and maintains clean white theme) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1
        }}
      />

      {/* Horizontal Sliding Track (Interactive elements float over image background) */}
      <div 
        style={{
          display: 'flex',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `translateX(-${currentSlide * 100}%)`,
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}
      >
        {campaignSlides.map((slide, idx) => {
          const isActive = idx === currentSlide
          return (
            <div 
              key={slide.id}
              style={{
                flex: '0 0 100%',
                width: '100%',
                background: 'transparent',
                color: '#0f172a',
                padding: '56px 6%',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              <div className="hero-slide-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
                
                {/* Left Side Content Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <span 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      color: slide.accentColor, 
                      letterSpacing: '0.08em',
                      backgroundColor: 'rgba(255,255,255,0.75)',
                      padding: '6px 14px',
                      borderRadius: '99px',
                      width: 'fit-content',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    {slide.eyebrow}
                  </span>
                  
                  <h1 
                    style={{ 
                      fontSize: '2.8rem', 
                      fontWeight: 900, 
                      lineHeight: 1.15, 
                      letterSpacing: '-0.02em',
                      color: '#0f172a',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {slide.title}
                  </h1>

                  <p 
                    style={{ 
                      fontSize: '0.98rem', 
                      color: '#475569', 
                      lineHeight: '1.5',
                      margin: 0,
                      maxWidth: '520px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {slide.sub}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <Link 
                      to={slide.ctaLink} 
                      style={{
                        backgroundColor: slide.accentColor,
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 14px rgba(15, 23, 42, 0.1)`
                      }}
                    >
                      {slide.ctaText} <FiArrowRight />
                    </Link>
                    
                    <Link 
                      to={slide.secondaryLink}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        border: '1px solid var(--border)',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-soft)'
                      }}
                    >
                      {slide.secondaryText}
                    </Link>
                  </div>

                  {/* Metrics */}
                  <div className="hero-slide-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                    {slide.metrics.map((metric, idx) => (
                      <div key={idx}>
                        <strong style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                          {metric.value}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Image Showcase Column */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '300px', 
                      aspectRatio: 1, 
                      backgroundColor: '#ffffff', 
                      borderRadius: 'var(--radius-lg)', 
                      padding: '20px', 
                      display: 'grid', 
                      placeItems: 'center',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.06)',
                      border: '1px solid var(--border)',
                      transform: isActive ? 'scale(1) rotate(0deg)' : 'scale(0.92) rotate(-2deg)',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {/* Slide Navigation Buttons */}
      <button 
        onClick={handlePrev} 
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.75)',
          border: '1px solid var(--border)',
          color: '#0f172a',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10,
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-soft)'
        }}
        aria-label="Previous Campaign"
      >
        <FiChevronLeft style={{ fontSize: '1.2rem' }} />
      </button>
      
      <button 
        onClick={handleNext} 
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.75)',
          border: '1px solid var(--border)',
          color: '#0f172a',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          zIndex: 10,
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-soft)'
        }}
        aria-label="Next Campaign"
      >
        <FiChevronRight style={{ fontSize: '1.2rem' }} />
      </button>

      {/* Slide Indicators */}
      <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {campaignSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentSlide === idx ? currentCampaign.accentColor : 'rgba(0,0,0,0.15)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  )
}

export default Hero
