import { useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ShopContext } from '../context/ShopContext'
import { fallbackCategories, fallbackProducts, normalizeProduct } from '../data/catalog'
import { fetchCategories, fetchProducts } from '../services/productService'

const Shop = () => {
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    const loadShop = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ])
        const apiProducts = productsResponse.data || []
        const apiCategories = categoriesResponse.data || []
        setProducts(apiProducts.length ? apiProducts.map(normalizeProduct) : fallbackProducts)
        setCategories(apiCategories.length ? apiCategories : fallbackCategories)
      } catch {
        setProducts(fallbackProducts)
        setCategories(fallbackCategories)
      }
    }

    loadShop()
  }, [])

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All')
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  const displayedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || product.category === category
      return matchesSearch && matchesCategory
    })

    const sorted = [...filtered]
    if (sort === 'price-low') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-high') {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return sorted
  }, [products, search, category, sort])

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Shop</h1>
        <p>Search, filter, and compare products in a clean grid made for quick browsing.</p>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products, brands, or categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setSearch('')
            setCategory('All')
            setSort('featured')
            setSearchParams({})
          }}
        >
          Reset
        </button>
      </div>

      <div className="product-grid">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            inWishlist={wishlist.some((item) => item._id === product._id)}
          />
        ))}
      </div>

      {!displayedProducts.length ? <p className="empty-state">No products found for this filter.</p> : null}
    </section>
  )
}

export default Shop
