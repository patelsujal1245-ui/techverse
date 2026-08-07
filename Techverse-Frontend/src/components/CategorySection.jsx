import { Link } from 'react-router-dom'

const CategorySection = ({ categories }) => (
  <section className="category-section">
    <div className="section-header">
      <h2>Shop by Category</h2>
      <p>Jump into the main product groups with one click.</p>
    </div>
    <div className="category-grid">
      {categories.map((category) => (
        <Link
          key={category.name}
          to={`/shop?category=${encodeURIComponent(category.name)}`}
          className="category-card"
        >
          {category.name}
        </Link>
      ))}
    </div>
  </section>
)

export default CategorySection
