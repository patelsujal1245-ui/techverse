import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi'

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        <div className="footer-logo">
          <strong>TechVerse</strong>
          <p>Curated campus electronics, designed for productivity and modern living. Premium quality, zero compromise.</p>
        </div>
        <div className="footer-col">
          <h4>Shop Catalog</h4>
          <ul>
            <li><Link to="/shop?category=Audio">Audio Essentials</Link></li>
            <li><Link to="/shop?category=Wearables">Wearables</Link></li>
            <li><Link to="/shop?category=Accessories">Accessories</Link></li>
            <li><Link to="/shop?category=Gaming">Gaming Gear</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/shop">All Products</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Developer info</h4>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">Documentation</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">API Endpoint Docs</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub Repo</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TechVerse. Built with React & Node.</p>
        <div className="footer-socials">
          <a href="https://github.com" target="_blank" rel="noreferrer" title="Github"><FiGithub /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter"><FiTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram"><FiInstagram /></a>
          <a href="mailto:support@techverse.demo" title="Support Mail"><FiMail /></a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer

