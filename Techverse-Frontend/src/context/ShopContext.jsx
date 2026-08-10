import { createContext, useEffect, useState } from 'react'

const CART_KEY = 'techverseCart'
const WISHLIST_KEY = 'techverseWishlist'

const readStorage = (key) => {
  const value = localStorage.getItem(key)
  if (!value) return []

  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const ShopContext = createContext()

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => readStorage(CART_KEY))
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY))

  useEffect(() => {
    writeStorage(CART_KEY, cart)
  }, [cart])

  useEffect(() => {
    writeStorage(WISHLIST_KEY, wishlist)
  }, [wishlist])

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id)
      const currentQty = existing ? existing.quantity : 0
      const totalRequested = currentQty + quantity
      const maxStock = product.stock !== undefined ? product.stock : 999
      const allowedQty = Math.min(totalRequested, maxStock)

      if (allowedQty <= 0) return current

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: allowedQty }
            : item,
        )
      }
      return [...current, { ...product, quantity: Math.min(quantity, maxStock) }]
    })
  }

  const updateCartQuantity = (productId, quantity) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item._id !== productId)
        : current.map((item) => {
            if (item._id === productId) {
              const maxStock = item.stock !== undefined ? item.stock : 999
              return { ...item, quantity: Math.min(quantity, maxStock) }
            }
            return item
          })
    )
  }

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item._id !== productId))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item._id === product._id)
      return exists
        ? current.filter((item) => item._id !== product._id)
        : [...current, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((item) => item._id !== productId))
  }

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
