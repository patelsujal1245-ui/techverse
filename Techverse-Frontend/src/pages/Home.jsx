import { useContext, useEffect, useState } from 'react'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import CategorySection from '../components/CategorySection'
import VideoAdSection from '../components/VideoAdSection'
import Newsletter from '../components/Newsletter'
import { ShopContext } from '../context/ShopContext'
import { fetchCategories, fetchProducts } from '../services/productService'
import { fallbackCategories, fallbackProducts, normalizeProduct } from '../data/catalog'

const Home = () => {
  const { addToCart, toggleWishlist, wishlist } = useContext(ShopContext)
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    const loadHome = async () => {
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

    loadHome()
  }, [])

  return (
    <div 
      style={{ 
        backgroundColor: '#ffffff', 
        minHeight: '100vh',
        width: '100%',
        color: 'var(--text)'
      }}
    >
      <main style={{ width: '100%', maxWidth: '100%', margin: '0', padding: '0' }}>
        <VideoAdSection />
        <Hero products={products} />
        <CategorySection categories={categories} theme="light" />
        <FeaturedProducts
          products={products}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlistIds={wishlist.map((item) => item._id)}
          theme="light"
        />
        <Newsletter />
      </main>
    </div>
  )
}

export default Home
