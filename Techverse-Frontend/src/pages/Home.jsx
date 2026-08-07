import { useContext, useEffect, useState } from 'react'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import CategorySection from '../components/CategorySection'
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
    <main>
      <Hero />
      <CategorySection categories={categories} />
      <FeaturedProducts
        products={products}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        wishlistIds={wishlist.map((item) => item._id)}
      />
      <Newsletter />
    </main>
  )
}

export default Home
