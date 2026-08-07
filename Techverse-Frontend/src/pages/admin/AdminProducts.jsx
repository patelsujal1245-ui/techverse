import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import { normalizeProduct, placeholderImage, safePrice } from '../../data/catalog'

const emptyForm = {
  name: '',
  brand: '',
  category: 'Audio',
  description: '',
  price: '',
  oldPrice: '',
  stock: '',
  images: '',
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [message, setMessage] = useState('')

  const loadData = async () => {
    try {
      setMessage('')
      const [productsResponse, categoriesResponse] = await Promise.all([fetchProducts(), fetchCategories()])
      const apiProducts = productsResponse.data || []
      const apiCategories = categoriesResponse.data || []
      setProducts(apiProducts.length ? apiProducts.map(normalizeProduct) : [])
      setCategories(apiCategories)
      if (!apiCategories.length) {
        setCategories([
          { name: 'Audio' },
          { name: 'Wearables' },
          { name: 'Accessories' },
          { name: 'Gaming' },
          { name: 'Smartphones' },
          { name: 'Laptops' },
          { name: 'Cameras' },
        ])
      }
    } catch {
      setMessage('Could not load admin products. Make sure you are logged in as admin.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const submitHandler = async (event) => {
    event.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock || 0),
      images: form.images
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
        setMessage('Product updated successfully.')
      } else {
        await createProduct(payload)
        setMessage('Product created successfully.')
      }
      setForm(emptyForm)
      setEditingId('')
      loadData()
    } catch {
      setMessage('Save failed. Check admin login and backend status.')
    }
  }

  const startEdit = (product) => {
    setEditingId(product._id)
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || 'Audio',
      description: product.description || '',
      price: product.price ?? '',
      oldPrice: product.oldPrice ?? '',
      stock: product.stock ?? '',
      images: (product.images || []).join('\n'),
    })
  }

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Admin Products</h1>
        <p>Manage products for the TechVerse catalog. Add, edit, or remove items from the live store.</p>
      </div>
      <p className="field-note">
        Enter local image paths from <code>/public/products</code>, one per line. Example: <code>/products/phone.svg</code>
      </p>
      <Link to="/admin/dashboard" className="text-link">
        Back to dashboard
      </Link>
      {message ? <p className="success-text">{message}</p> : null}

      <form className="admin-form" onSubmit={submitHandler}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          placeholder="Old Price"
          type="number"
          value={form.oldPrice}
          onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <textarea
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <textarea
          placeholder="Image paths from /public/products, one per line"
          rows="4"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
        />
        <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
        {editingId ? (
          <button type="button" className="secondary" onClick={() => { setEditingId(''); setForm(emptyForm) }}>
            Cancel Edit
          </button>
        ) : null}
      </form>

      <div className="product-list admin-list">
        {products.map((product) => (
          <article key={product._id} className="admin-row">
            <img
              src={product.images?.[0] || placeholderImage}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src = placeholderImage
              }}
            />
            <div>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <p>{safePrice(product.price)}</p>
            </div>
            <div className="card-actions">
              <button type="button" onClick={() => startEdit(product)}>
                Edit
              </button>
              <button
                type="button"
                className="secondary"
                onClick={async () => {
                  const ok = window.confirm(`Delete ${product.name}?`)
                  if (!ok) return
                  await deleteProduct(product._id)
                  loadData()
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminProducts
