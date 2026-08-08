import mongoose from 'mongoose'

const orderItemSchema = mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
)

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: { type: Object, required: true },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    orderStatus: { type: String, default: 'Pending' },
    currentLocation: { type: String, default: 'Noida Sorting Hub' },
    estimatedDelivery: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)
export default Order
