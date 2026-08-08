import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import { normalizeProduct, placeholderImage, safePrice } from '../../data/catalog'
import { FiEdit, FiTrash2, FiArrowLeft, FiUploadCloud } from 'react-icons/fi'
import api from '../../services/api'

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
  
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

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

  const handleFileUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}\n${data.url}` : data.url,
      }))
      setMessage('Image uploaded successfully.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Image upload failed. Make sure server is running.')
    } finally {
      setUploading(false)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => {
    setDragOver(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

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
        Upload files using the drag-and-drop zone or enter image paths manually, one per line.
      </p>
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/dashboard" className="text-link">
          <FiArrowLeft /> Back to dashboard
        </Link>
      </div>
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
        
        <div
          className={`upload-dropzone ${dragOver ? 'dragover' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => document.getElementById('file-upload-input').click()}
        >
          <FiUploadCloud className="upload-dropzone-icon" />
          <p>{uploading ? 'Uploading image...' : 'Drag & drop product image here, or click to browse'}</p>
          <span>Supports JPEG, PNG, WEBP, SVG (Max 5MB)</span>
          <input
            id="file-upload-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileSelect}
          />
        </div>

        {form.images ? (
          <div className="upload-preview-container">
            {form.images.split('\n').filter(Boolean).map((img, idx) => {
              const VITE_API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`
              const BACKEND_URL = VITE_API_URL.replace(/\/api\/?$/, '')
              const resolvedImg = img.startsWith('/uploads') ? `${BACKEND_URL}${img}` : img

              return (
                <div key={idx} className="upload-preview-item" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={resolvedImg}
                    alt="Preview"
                    className="upload-preview"
                    onError={(e) => { e.target.src = placeholderImage }}
                  />
                  <div className="upload-preview-info">
                    <span>{img.split('/').pop()}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = form.images
                          .split('\n')
                          .filter((_, i) => i !== idx)
                          .join('\n')
                        setForm({ ...form, images: newImages })
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}

        <textarea
          placeholder="Image paths from /public/products or uploaded URLs, one per line"
          rows="3"
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
              <button type="button" onClick={() => startEdit(product)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FiEdit /> Edit
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminProducts


