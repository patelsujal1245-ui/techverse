import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ShopProvider } from './context/ShopContext'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />
            <main className="content-shell">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ShopProvider>
    </AuthProvider>
  )
}

export default App
