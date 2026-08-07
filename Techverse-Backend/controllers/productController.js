import Product from '../models/Product.js'

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
    stock,
    images,
    specifications,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
}

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    Object.assign(product, req.body)
    const updatedProduct = await product.save()
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
