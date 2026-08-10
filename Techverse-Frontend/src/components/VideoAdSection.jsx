import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiVolume2, FiVolumeX, FiCpu, FiCamera, FiWatch, FiPlay, FiSmartphone, FiTablet, FiTv } from 'react-icons/fi'

const adsData = [
  {
    id: 'wearable',
    title: 'Apple Watch Ultra: Premium Activewear',
    desc: 'Unleash your potential with professional outdoor tracking, precision dual-frequency GPS, deep diving capability, and a durable aerospace titanium build.',
    videoUrl: '/videos/apple_watch.mp4',
    tag: 'Wearables',
    icon: <FiWatch />,
    color: '#059669',
    shopLink: '/shop?category=Wearables',
    badge: '50m Water Resistant • Dual-Frequency GPS • Titanium Build',
    metrics: [
      { name: 'Water Resistance', score: 100, color: '#059669' },
      { name: 'GPS Accuracy', score: 98, color: '#34d399' },
      { name: 'Build Durability', score: 95, color: '#10b981' },
      { name: 'Battery Efficiency', score: 75, color: '#059669' }
    ]
  },
  {
    id: 'audio',
    title: 'Sony WH-1000XM5: Immersive Acoustics',
    desc: 'Experience industry-leading active noise cancellation powered by dual processors and a 4-mic system. Crafted for pure audio immersion and pristine call clarity.',
    videoUrl: '/videos/sony_headphones.mp4',
    tag: 'Audio',
    icon: <FiVolume2 />,
    color: '#4f46e5',
    shopLink: '/shop?category=Audio',
    badge: 'Dual Processor ANC • Hi-Res Audio • 30h Battery',
    metrics: [
      { name: 'Active Noise Cancellation', score: 98, color: '#4f46e5' },
      { name: 'Acoustic Fidelity', score: 95, color: '#6366f1' },
      { name: 'Comfort rating', score: 92, color: '#818cf8' },
      { name: 'Battery Life', score: 90, color: '#4f46e5' }
    ]
  },
  {
    id: 'camera',
    title: 'Sony ZV Creator Kit: Capture Passion',
    desc: 'Step up your content creation, streaming, and daily vlogging. Features 4K video capture, real-time eye tracking, flip screen, and interchangeable lens options.',
    videoUrl: '/videos/sony_zv.mp4',
    tag: 'Cameras',
    icon: <FiCamera />,
    color: '#db2777',
    shopLink: '/shop?category=Cameras',
    badge: '4K Movie Capture • Phase-Detection AF • Product Showcase Setting',
    metrics: [
      { name: 'Autofocus Speed', score: 99, color: '#db2777' },
      { name: '4K Rendering Quality', score: 95, color: '#f43f5e' },
      { name: 'Microphone Sensitivity', score: 90, color: '#ec4899' },
      { name: 'Low Light Aperture', score: 85, color: '#db2777' }
    ]
  },
  {
    id: 'workspace',
    title: 'MacBook Pro: Next-Gen Compute',
    desc: 'Fly through complex coding, software compilation, graphics, and assignments with liquid retina extreme dynamic range displays and massive battery life.',
    videoUrl: '/videos/macbook_pro.mp4',
    tag: 'Laptops',
    icon: <FiCpu />,
    color: '#0891b2',
    shopLink: '/shop?category=Laptops',
    badge: 'Liquid Retina XDR • Pro-Level GPU • 22h Battery Life',
    metrics: [
      { name: 'Compilation Speed', score: 99, color: '#0891b2' },
      { name: 'GPU Acceleration', score: 96, color: '#06b6d4' },
      { name: 'Thermal Management', score: 92, color: '#22d3ee' },
      { name: 'Battery Lifespan', score: 95, color: '#0891b2' }
    ]
  },
  {
    id: 'playstation',
    title: 'Sony PlayStation 5 Slim: Dynamic Play',
    desc: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    videoUrl: '/videos/playstation_5.webm',
    tag: 'Gaming',
    icon: <FiTv />,
    color: '#3b82f6',
    shopLink: '/shop?category=Gaming',
    badge: 'Same Immersive Power • New Slimmer Size • 1TB Storage SSD',
    metrics: [
      { name: 'Graphics Performance', score: 99, color: '#3b82f6' },
      { name: 'SSD Load Speed', score: 98, color: '#60a5fa' },
      { name: '3D Audio Immersion', score: 94, color: '#2563eb' },
      { name: 'System Cooling', score: 90, color: '#3b82f6' }
    ]
  },
  {
    id: 'iphone',
    title: 'iPhone 17 Air: Pure Elegance',
    desc: 'Marvel at the thinnest smartphone design ever engineered by Apple. Combines an ultra-light aluminum enclosure, A19 processing, and Apple Intelligence.',
    videoUrl: '/videos/iphone_17_air.mp4',
    tag: 'Smartphones',
    icon: <FiSmartphone />,
    color: '#ec4899',
    shopLink: '/shop?category=Smartphones',
    badge: 'Thinnest iPhone Ever • Titanium Shell • Apple Intelligence',
    metrics: [
      { name: 'Design Sleekness', score: 100, color: '#ec4899' },
      { name: 'CPU Speed', score: 95, color: '#f43f5e' },
      { name: 'Display Refresh', score: 92, color: '#db2777' },
      { name: 'Battery Endurance', score: 88, color: '#ec4899' }
    ]
  },
  {
    id: 's25_ultra',
    title: 'Samsung Galaxy S25 Ultra: AI Superphone',
    desc: 'Unleash your creativity with advanced Galaxy AI capabilities, a 200MP camera zoom matrix, and Snapdragon Gen 4 processing in a titanium border frame.',
    videoUrl: '/videos/s25_ultra.mp4',
    tag: 'Smartphones',
    icon: <FiSmartphone />,
    color: '#0284c7',
    shopLink: '/shop?category=Smartphones',
    badge: '200MP Camera Zoom • Galaxy AI Assistant • S Pen Support',
    metrics: [
      { name: 'AI Computation', score: 99, color: '#0284c7' },
      { name: 'Camera Zoom Depth', score: 98, color: '#38bdf8' },
      { name: 'Display Brightness', score: 96, color: '#0369a1' },
      { name: 'Stylus Responsiveness', score: 95, color: '#0284c7' }
    ]
  },
  {
    id: 'tab_s9',
    title: 'Samsung Galaxy Tab S9 Ultra: Infinite Workspace',
    desc: 'Bring your creative ideas to life with a massive 14.6" dynamic AMOLED display, IP68 water resistance, and the included ultra-precise Bluetooth S Pen.',
    videoUrl: '/videos/tab_s9_ultra.mp4',
    tag: 'Tablets',
    icon: <FiTablet />,
    color: '#8b5cf6',
    shopLink: '/shop?category=Tablets',
    badge: '14.6" AMOLED Screen • IP68 Water Proof • Included S Pen',
    metrics: [
      { name: 'Screen Real Estate', score: 98, color: '#8b5cf6' },
      { name: 'Stylus Precision', score: 97, color: '#a78bfa' },
      { name: 'Water Resistance', score: 95, color: '#6d28d9' },
      { name: 'Multitasking Efficiency', score: 94, color: '#8b5cf6' }
    ]
  }
]

const VideoAdSection = () => {
  const [activeAd, setActiveAd] = useState(adsData[0])
  const [isMuted, setIsMuted] = useState(true)
  const [animateWidths, setAnimateWidths] = useState(false)

  // Trigger progress bar filling animation when switching active products
  useEffect(() => {
    setAnimateWidths(false)
    const timeout = setTimeout(() => setAnimateWidths(true), 150)
    return () => clearTimeout(timeout)
  }, [activeAd])

  // Automatically unmute when user interacts with loop selection if they already unmuted once
  const handleAdSwitch = (ad) => {
    setActiveAd(ad)
  }

  const handleVideoEnded = () => {
    const currentIdx = adsData.findIndex((ad) => ad.id === activeAd.id)
    const nextIdx = (currentIdx + 1) % adsData.length
    setActiveAd(adsData[nextIdx])
  }

  return (
    <section 
      style={{ 
        margin: '20px 0 60px 0', 
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '50px 6%',
        boxShadow: '0 25px 60px -25px rgba(15, 23, 42, 0.06), var(--shadow-soft)',
        border: '1px solid var(--border)',
        color: 'var(--text)'
      }}
      className="showroom-cinematic-wrapper"
    >
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: activeAd.color, letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
            Cinematic Ad Showroom
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-0.03em', color: 'var(--text)', margin: 0 }}>
            Interactive Theater
          </h2>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
          Enjoy the high-fidelity sound loops. Toggle the volume icon on the player to hear native audio reviews.
        </p>
      </div>

      {/* STAGE 1: Full-Width Ultrawide Bezel Video Player (Large Cinema Screen) */}
      <div 
        style={{ 
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '5px solid #ffffff',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(0,0,0,0.05)',
          backgroundColor: '#f8fafc',
          aspectRatio: '2.3/1',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center'
        }}
        className="cinema-stage"
      >
        {/* Ambient projection glow behind cinema card */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle, ${activeAd.color}0f 0%, transparent 80%)`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <video
          key={activeAd.id}
          src={activeAd.videoUrl}
          autoPlay
          onEnded={handleVideoEnded}
          muted={isMuted}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 2 }}
        />
        
        {/* Top Floating Category Overlay Badge */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '99px',
              padding: '6px 16px',
              fontSize: '0.72rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            <FiPlay style={{ color: activeAd.color }} /> {activeAd.tag} Live Review
          </div>
        </div>

        {/* BOTTOM RIGHT: Futuristic Glowing Audio Controller Toggle Badge */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 10 }}>
          <button
            onClick={() => setIsMuted(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: isMuted ? 'rgba(15, 23, 42, 0.85)' : activeAd.color,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '99px',
              padding: '10px 20px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: isMuted ? '0 8px 20px rgba(0,0,0,0.2)' : `0 8px 24px ${activeAd.color}50`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            title={isMuted ? 'Unmute stereophonic loop sound' : 'Mute loop sound'}
            className="audio-controller-btn"
          >
            {isMuted ? (
              <>
                <FiVolumeX style={{ fontSize: '1rem' }} />
                <span>SOUND MUTED</span>
              </>
            ) : (
              <>
                {/* CSS animated equalizer waves */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '12px' }}>
                  <div className="wave-bar" style={{ animationDelay: '0.1s' }} />
                  <div className="wave-bar" style={{ animationDelay: '0.3s' }} />
                  <div className="wave-bar" style={{ animationDelay: '0.5s' }} />
                  <div className="wave-bar" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>SOUND ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STAGE 2: Interactive Grid details and controls below the Player */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 0.8fr', 
          gap: '40px', 
          alignItems: 'start' 
        }}
        className="cinematic-info-grid"
      >
        
        {/* Left Side: Specifications & Ratings Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {activeAd.title}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              {activeAd.desc}
            </p>
          </div>

          {/* Performance scorecard details */}
          <div 
            style={{ 
              backgroundColor: '#f8fafc', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <FiCpu style={{ color: activeAd.color }} /> HARDWARE SCORECARD COMPARISON
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeAd.metrics.map((metric, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
                    <span>{metric.name}</span>
                    <span>{metric.score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: animateWidths ? `${metric.score}%` : '0%', 
                        height: '100%', 
                        backgroundColor: metric.color, 
                        borderRadius: '99px',
                        transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Tab Selectors & CTA link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>
            Switch Ad Footages
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {adsData.map((ad) => {
              const isActive = ad.id === activeAd.id
              return (
                <button
                  key={ad.id}
                  onClick={() => handleAdSwitch(ad)}
                  style={{
                    background: isActive ? 'var(--bg-soft)' : '#ffffff',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border)' : 'rgba(0,0,0,0.04)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text)',
                    boxShadow: isActive ? 'var(--shadow-soft)' : 'none'
                  }}
                  className={`showroom-row-btn ${isActive ? 'active' : ''}`}
                >
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? ad.color : 'var(--bg-soft)',
                      color: '#ffffff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  >
                    {ad.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: isActive ? 'var(--text)' : 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ad.title.split(':')[0]}
                    </strong>
                  </div>

                  {isActive && (
                    <div style={{ width: '3px', height: '16px', backgroundColor: ad.color, borderRadius: '99px', flexShrink: 0 }} />
                  )}
                </button>
              )
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '12px' }}>
              RETAIL PRODUCT SPECIFICATIONS
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 700, marginBottom: '16px', background: 'var(--bg-soft)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
              {activeAd.badge}
            </div>

            <Link 
              to={activeAd.shopLink} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 20px', 
                backgroundColor: activeAd.color,
                color: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.88rem',
                textDecoration: 'none', 
                width: '100%', 
                justifyContent: 'center',
                boxShadow: `0 4px 14px ${activeAd.color}30`,
                transition: 'all 0.3s ease'
              }}
              className="showroom-cta-action"
            >
              Shop Category <FiArrowRight />
            </Link>
          </div>

        </div>

      </div>

      {/* Embedded CSS rules for animated waveforms */}
      <style>{`
        @keyframes wave-bounce {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        .wave-bar {
          width: 2px;
          background-color: #ffffff;
          animation: wave-bounce 0.8s ease-in-out infinite;
          border-radius: 99px;
        }
        .audio-controller-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
        }
        .showroom-cta-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${activeAd.color}50 !important;
        }
      `}</style>
    </section>
  )
}

export default VideoAdSection
