import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('techverseUser')
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('techverseUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('techverseUser')
    }
  }, [user])

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
