import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const adsData = [
  {
    id: 'wearable',
    title: 'Apple Watch Ultra: Premium Activewear',
    desc: 'Unleash your potential with professional outdoor tracking, precision dual-frequency GPS, deep diving capability, and a durable aerospace titanium build.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smart-watch-close-up-42251-large.mp4',
    tag: 'Wearables',
    shopLink: '/shop?category=Wearables',
    badge: '50m Water Resistant • Dual-Frequency GPS • Titanium Build'
  },
  {
    id: 'audio',
    title: 'Sony WH-1000XM5: Deep Immersive Acoustics',
    desc: 'Experience industry-leading active noise cancellation powered by dual processors and a 4-mic system. Crafted for pure audio immersion and pristine call clarity.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-resting-on-a-computer-keyboard-41315-large.mp4',
    tag: 'Audio',
    shopLink: '/shop?category=Audio',
    badge: 'Dual Processor ANC • Hi-Res Audio • 30h Battery'
  },
  {
    id: 'camera',
    title: 'Sony ZV Creator Kit: Capture Your Passion',
    desc: 'Step up your content creation, streaming, and daily vlogging. Features 4K video capture, real-time eye tracking, flip screen, and interchangeable lens options.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-photo-camera-details-close-up-42296-large.mp4',
    tag: 'Cameras',
    shopLink: '/shop?category=Cameras',
    badge: '4K Movie Capture • Phase-Detection AF • Product Showcase Setting'
  },
  {
    id: 'workspace',
    title: 'MacBook Pro: Next-Generation Compute',
    desc: 'Fly through complex coding, software compilation, graphics, and assignments with liquid retina extreme dynamic range displays and massive battery life.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-keyboard-of-a-laptop-close-up-41314-large.mp4',
    tag: 'Laptops',
    shopLink: '/shop?category=Laptops',
    badge: 'Liquid Retina XDR • Pro-Level GPU • 22h Battery Life'
  }
]

const VideoAdSection = () => {
  const [activeAd, setActiveAd] = useState(adsData[0])

  return (
    <section className="video-ad-section cinematic-theme" style={{ margin: '60px 0' }}>
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <span className="eyebrow" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Interactive Showroom</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Featured Product Spotlights</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Watch dynamic product loops showcasing active design profiles and key specifications.</p>
      </div>

      {/* Cinematic Theater Video Player */}
      <div className="cinematic-player-wrapper" style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: '#000', boxShadow: 'var(--shadow-soft)', position: 'relative' }}>
        <div className="video-player-container" style={{ position: 'relative', width: '100%', aspectRatio: '2.1/1', display: 'block', overflow: 'hidden' }}>
          <video
            key={activeAd.id}
            src={activeAd.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="main-ad-video"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Top Tag Overlay */}
          <div className="video-player-overlay" style={{ position: 'absolute', top: '24px', left: '24px', pointerEvents: 'none', zIndex: 2 }}>
            <span className="video-overlay-tag" style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff', padding: '6px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
              {activeAd.tag}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Menu Tabs */}
      <div 
        className="showroom-tabs-container" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px', 
          marginTop: '20px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '20px'
        }}
      >
        {adsData.map((ad) => {
          const isActive = ad.id === activeAd.id
          return (
            <button
              key={ad.id}
              onClick={() => setActiveAd(ad)}
              className={`showroom-tab ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? 'var(--bg-soft)' : 'transparent',
                border: '1px solid var(--border)',
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: isActive ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>{ad.tag}</span>
              <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{ad.title.split(':')[0]}</strong>
            </button>
          )}
        )}
      </div>

      {/* Details Description Row */}
      <div 
        className="showroom-details-card" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 0.8fr', 
          gap: '40px', 
          padding: '24px 0', 
          alignItems: 'center' 
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{activeAd.tag} Campaign</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>{activeAd.title}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>{activeAd.desc}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '0.82rem', padding: '12px 16px', backgroundColor: 'var(--bg-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: '100%' }}>
            <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '4px' }}>Key Specs:</strong>
            <span style={{ color: 'var(--muted)' }}>{activeAd.badge}</span>
          </div>
          <Link to={activeAd.shopLink} className="hero-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', textDecoration: 'none', width: '100%', justifyContent: 'center' }}>
            Shop Featured Item <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default VideoAdSection
