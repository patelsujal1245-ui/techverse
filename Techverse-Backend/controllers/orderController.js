import Order from '../models/Order.js'
import Product from '../models/Product.js'
import StockLog from '../models/StockLog.js'

export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' })
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash On Delivery',
    totalPrice,
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days default estimate
  })

  const createdOrder = await order.save()

  // Decrement stock and write StockLog
  for (const item of orderItems) {
    const product = await Product.findById(item.product)
    if (product) {
      const oldStock = product.stock || 0
      const newStock = Math.max(0, oldStock - item.quantity)
      product.stock = newStock
      await product.save()

      await StockLog.create({
        product: product._id,
        productName: product.name,
        changeType: 'Sale',
        quantityChanged: -item.quantity,
        oldStock,
        newStock,
        details: `Order #${createdOrder._id.toString().substring(18)}`
      })
    }
  }

  res.status(201).json(createdOrder)
}

export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 })
  res.json(orders)
}

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
}

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')
  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}

export const updateOrderStatus = async (req, res) => {
  const { orderStatus, currentLocation, estimatedDelivery } = req.body
  const order = await Order.findById(req.params.id)

  if (order) {
    if (orderStatus && order.orderStatus !== orderStatus) {
      const prevStatus = order.orderStatus
      order.orderStatus = orderStatus
      if (orderStatus === 'Completed') {
        order.deliveredAt = new Date()
      } else if (orderStatus === 'Shipping') {
        order.shippedAt = new Date()
      } else if (orderStatus === 'Cancelled' && prevStatus !== 'Cancelled') {
        order.currentLocation = 'Order Cancelled by Admin'
        // Restore stock and write log
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product)
          if (product) {
            const oldStock = product.stock || 0
            const newStock = oldStock + item.quantity
            product.stock = newStock
            await product.save()

            await StockLog.create({
              product: product._id,
              productName: product.name,
              changeType: 'Cancellation',
              quantityChanged: item.quantity,
              oldStock,
              newStock,
              details: `Order #${order._id.toString().substring(18)} Cancelled by Admin`
            })
          }
        }
      }
    }
    
    if (currentLocation !== undefined) {
      order.currentLocation = currentLocation
    }
    
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery)
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' })
    }

    if (order.orderStatus === 'Shipping' || order.orderStatus === 'Completed' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled in its current stage.' })
    }

    order.orderStatus = 'Cancelled'
    order.currentLocation = 'Order Cancelled by Customer'
    
    // Restore stock and write log
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product)
      if (product) {
        const oldStock = product.stock || 0
        const newStock = oldStock + item.quantity
        product.stock = newStock
        await product.save()

        await StockLog.create({
          product: product._id,
          productName: product.name,
          changeType: 'Cancellation',
          quantityChanged: item.quantity,
          oldStock,
          newStock,
          details: `Order #${order._id.toString().substring(18)} Cancelled by Customer`
        })
      }
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}
