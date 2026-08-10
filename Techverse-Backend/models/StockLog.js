import mongoose from 'mongoose'

const stockLogSchema = mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    changeType: { 
      type: String, 
      enum: ['Sale', 'Cancellation', 'Admin Adjustment', 'Restock'], 
      required: true 
    },
    quantityChanged: { type: Number, required: true },
    oldStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    details: { type: String },
  },
  { timestamps: true }
)

const StockLog = mongoose.model('StockLog', stockLogSchema)
export default StockLog
