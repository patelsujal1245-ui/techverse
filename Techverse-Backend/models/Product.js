import mongoose from 'mongoose'

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
    specifications: { type: Object },
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)
export default Product
