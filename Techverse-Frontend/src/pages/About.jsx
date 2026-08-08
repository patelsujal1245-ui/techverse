import { FiTarget, FiTruck, FiShield, FiCpu, FiAward, FiBookOpen, FiArrowRight, FiMessageSquare } from 'react-icons/fi'

const About = () => {
  const triggerAIChat = (topic = '') => {
    window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { topic } }))
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 0 60px' }}>
      {/* Brand Hero Header */}
      <div 
        className="about-hero" 
        style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          marginBottom: '56px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <span 
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#0d9488',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'inline-block',
            marginBottom: '16px'
          }}
        >
          About TechVerse Store
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '20px', letterSpacing: '-0.04em', lineHeight: '1.15' }}>
          Providing Seamless Campus <br />& Everyday Retail Solutions
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.65' }}>
          TechVerse is a MERN-stack supermarket uniting high-performance consumer technology, fresh grocery essentials, and daily-use personal care items.
        </p>
      </div>

      {/* Grid: Narrative & AI Callout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 0.7fr',
          gap: '48px',
          marginBottom: '64px',
          alignItems: 'start'
        }}
        className="about-narrative-grid"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            Unifying Tech & Daily Essentials
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.7' }}>
            We started TechVerse with a clear vision: to design an e-commerce hub where clients could procure both advanced electronics and daily provisions in a single order, saving delivery costs and routing delays. 
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.7' }}>
            Today, our store operates a highly responsive database tracking 60+ products. We manage direct local supplier agreements for fresh grains, mustard oils, and personal care brands, and sync them alongside leading technology products.
          </p>
          
          {/* Timeline / Roadmap */}
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginTop: '16px', marginBottom: '8px' }}>
            Development Timeline
          </h3>
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-dot" style={{ backgroundColor: '#0d9488' }} />
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)' }}>Phase 1: Foundation (Tech Core)</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>Launched basic MERN authentication and checkout flows for local electronics items.</span>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot" style={{ backgroundColor: '#7c3aed' }} />
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)' }}>Phase 2: Supermarket Catalog</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>Expanded the database to 61 products, introducing INR pricing and grocery selections.</span>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot" style={{ backgroundColor: '#2563eb' }} />
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text)' }}>Phase 3: AI Customer Care</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>Integrated floating AI Chatbots for instant priority grievance tickets and product troubleshooting.</span>
            </div>
          </div>
        </div>

        {/* AI Support Invitation Card */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-soft)',
            position: 'sticky',
            top: '100px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '1.4rem', marginBottom: '20px' }}>
            <FiMessageSquare />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Need AI Guidance?
          </h3>
          <p style={{ color: '#1e40af', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Our smart support agent is trained to handle complaints, explain refunds, track orders, and assist with server-side setup queries.
          </p>
          <button 
            onClick={() => triggerAIChat('Hello! I need guidance')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#1e3a8a',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.25)'
            }}
          >
            Launch AI Chatbot <FiArrowRight />
          </button>
        </div>
      </div>

      {/* Pillars Section */}
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '32px', textAlign: 'center', letterSpacing: '-0.03em' }}>
        Why Shop At TechVerse?
      </h2>
      <div className="about-pillars-grid">
        <article className="pillar-card">
          <div className="pillar-icon-wrapper" style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}>
            <FiAward />
          </div>
          <h3>Verified Brand Quality</h3>
          <p>
            Every tech accessory and grocery essential is checked for compliance and expiration. We only stock items from certified suppliers.
          </p>
        </article>

        <article className="pillar-card">
          <div className="pillar-icon-wrapper" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <FiTruck />
          </div>
          <h3>Same-Day Dispatch</h3>
          <p>
            No more waiting days for provisions. Our express dispatch routes deliver grocery and pantry orders on the same day.
          </p>
        </article>

        <article className="pillar-card">
          <div className="pillar-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <FiShield />
          </div>
          <h3>AI Grievance Lodge</h3>
          <p>
            Encountered an issue? Type to our AI assistant to instantly register ticket IDs. We guarantee 1-hour resolution emails.
          </p>
        </article>
      </div>

      {/* Tech Grid */}
      <div 
        style={{
          background: 'var(--surface-solid)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px',
          boxShadow: 'var(--shadow-soft)'
        }}
      >
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', textAlign: 'center', letterSpacing: '-0.03em' }}>
          MERN Full-Stack Infrastructure
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          TechVerse is backed by a robust, secure engineering stack designed to maintain product inventory synchronicities and order flows.
        </p>
        
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
          className="about-tech-grid"
        >
          <div style={{ padding: '24px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'grid', placeItems: 'center', color: '#2563eb', fontSize: '1.1rem', margin: '0 auto 12px' }}>
              <FiCpu />
            </div>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>React 18</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4', display: 'block' }}>Vite client compilation, dynamic SPA routing</span>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'grid', placeItems: 'center', color: '#166534', fontSize: '1.1rem', margin: '0 auto 12px' }}>
              <FiBookOpen />
            </div>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>NodeJS</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4', display: 'block' }}>V8 engine API server runtime</span>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#faf5ff', display: 'grid', placeItems: 'center', color: '#7c3aed', fontSize: '1.1rem', margin: '0 auto 12px' }}>
              <FiTarget />
            </div>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>Express</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4', display: 'block' }}>REST endpoint control controllers</span>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fffbeb', display: 'grid', placeItems: 'center', color: '#d97706', fontSize: '1.1rem', margin: '0 auto 12px' }}>
              <FiShield />
            </div>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>MongoDB</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4', display: 'block' }}>NoSQL document storage mapping</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
