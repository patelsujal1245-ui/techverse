const About = () => (
  <section className="page-shell">
    <div className="section-header">
      <h1>About TechVerse</h1>
      <p>TechVerse is a beginner-friendly electronics store built with the MERN stack.</p>
    </div>
    <div className="info-grid">
      <article className="info-card">
        <h3>Goal</h3>
        <p>Show a complete ecommerce flow with clean UI, sensible logic, and a realistic shopping path.</p>
      </article>
      <article className="info-card">
        <h3>Stack</h3>
        <p>React, Vite, Express, MongoDB, Mongoose, JWT auth, and local cart/wishlist storage.</p>
      </article>
      <article className="info-card">
        <h3>Scope</h3>
        <p>Browse products, manage a cart, checkout, login, profile, and basic admin CRUD.</p>
      </article>
    </div>
  </section>
)

export default About
