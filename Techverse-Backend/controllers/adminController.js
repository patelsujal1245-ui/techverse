import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

const buildMonthlySales = (orders) => {
  const buckets = new Map()

  orders.forEach((order) => {
    const key = new Date(order.createdAt).toLocaleString('en-IN', {
      month: 'short',
      year: 'numeric',
    })
    buckets.set(key, (buckets.get(key) || 0) + Number(order.totalPrice || 0))
  })

  return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }))
}

const buildCategoryBreakdown = (products) => {
  const counts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).map(([label, value]) => ({ label, value }))
}

const buildTopProducts = (orders, products) => {
  const soldByProduct = new Map()
  const productMap = new Map(products.map((product) => [String(product._id), product]))

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const key = String(item.product)
      const current = soldByProduct.get(key) || { sold: 0, revenue: 0 }
      current.sold += Number(item.quantity || 0)
      current.revenue += Number(item.quantity || 0) * Number(item.price || 0)
      soldByProduct.set(key, current)
    })
  })

  return Array.from(soldByProduct.entries())
    .map(([productId, stats]) => {
      const product = productMap.get(productId)
      return {
        name: product?.name || 'Unknown product',
        sold: stats.sold,
        revenue: stats.revenue,
      }
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
}

export const getAdminInfo = async (req, res) => {
  res.json({ message: 'Admin route is working', user: req.user?.email || null })
}

export const getAdminStats = async (req, res) => {
  const [products, users, orders] = await Promise.all([
    Product.find({}),
    User.find({}),
    Order.find({}),
  ])

  const revenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)
  const admins = users.filter((user) => user.role === 'admin').length
  const pendingOrders = orders.filter((order) => order.orderStatus === 'Pending').length
  const monthlySales = buildMonthlySales(orders)
  const categoryBreakdown = buildCategoryBreakdown(products)
  const topProducts = buildTopProducts(orders, products)

  res.json({
    totals: {
      products: products.length,
      users: users.length,
      admins,
      orders: orders.length,
      revenue,
      averageOrderValue: orders.length ? revenue / orders.length : 0,
      pendingOrders,
    },
    demographics: {
      users: users.length - admins,
      admins,
    },
    categoryBreakdown,
    monthlySales,
    topProducts,
  })
}

