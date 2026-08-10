import Product from '../models/Product.js'
import StockLog from '../models/StockLog.js'

export const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: 'i' },
      }
    : {}

  const category = req.query.category
    ? { category: req.query.category }
    : {}

  const products = await Product.find({ ...keyword, ...category }).sort({ createdAt: -1 })
  res.json(products)
}

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}

export const createProduct = async (req, res) => {
  const { name, brand, category, description, price, oldPrice, stock, images, specifications } = req.body
  const product = new Product({
    name,
    brand,
    category,
    description,
    price,
    oldPrice,
    stock: stock || 0,
    images,
    specifications,
  })

  const createdProduct = await product.save()

  // Log initial stock creation if stock > 0
  if (createdProduct.stock > 0) {
    await StockLog.create({
      product: createdProduct._id,
      productName: createdProduct.name,
      changeType: 'Admin Adjustment',
      quantityChanged: createdProduct.stock,
      oldStock: 0,
      newStock: createdProduct.stock,
      details: 'Initial Product Creation'
    })
  }

  res.status(201).json(createdProduct)
}

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    const oldStock = product.stock || 0
    const newStock = req.body.stock !== undefined ? Number(req.body.stock) : oldStock

    Object.assign(product, req.body)
    const updatedProduct = await product.save()

    if (req.body.stock !== undefined && newStock !== oldStock) {
      await StockLog.create({
        product: product._id,
        productName: product.name,
        changeType: 'Admin Adjustment',
        quantityChanged: newStock - oldStock,
        oldStock,
        newStock,
        details: 'Updated by Admin'
      })
    }

    res.json(updatedProduct)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.deleteOne()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}
