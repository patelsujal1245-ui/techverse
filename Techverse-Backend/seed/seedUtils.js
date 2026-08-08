import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Order from '../models/Order.js'
import { defaultUsers, defaultCategories, defaultProducts } from './defaultData.js'

const buildOrderSeed = (products, customerId) => ({
  user: customerId,
  orderItems: [
    {
      product: products[0]._id,
      name: products[0].name,
      quantity: 1,
      price: products[0].price,
    },
  ],
  shippingAddress: {
    address: '123 College Lane',
    city: 'Pune',
    postalCode: '411001',
    country: 'India',
  },
  paymentMethod: 'Cash On Delivery',
  totalPrice: products[0].price,
})

export const seedDefaultData = async () => {
  // 1. Users seeding
  const seededUsers = []
  for (const defaultUser of defaultUsers) {
    let user = await User.findOne({ email: defaultUser.email })
    if (!user) {
      const hashedPassword = await bcrypt.hash(defaultUser.password, 10)
      user = await User.create({
        ...defaultUser,
        password: hashedPassword
      })
    }
    seededUsers.push(user)
  }

  // 2. Categories seeding
  for (const defaultCategory of defaultCategories) {
    const exists = await Category.findOne({ name: defaultCategory.name })
    if (!exists) {
      await Category.create(defaultCategory)
    }
  }

  // 3. Products seeding
  const seededProducts = []
  for (const defaultProduct of defaultProducts) {
    let product = await Product.findOne({ name: defaultProduct.name })
    if (!product) {
      product = await Product.create(defaultProduct)
    }
    seededProducts.push(product)
  }

  // 4. Default Order seeding
  const orderCount = await Order.countDocuments()
  if (orderCount === 0) {
    const customer = seededUsers.find((user) => user.email === 'jane@techverse.com')
    if (customer && seededProducts.length) {
      await Order.create({
        user: customer._id,
        orderItems: [
          {
            product: seededProducts[0]._id,
            name: seededProducts[0].name,
            quantity: 1,
            price: seededProducts[0].price,
          },
        ],
        shippingAddress: {
          street: '123 College Lane',
          city: 'Pune',
          state: 'Maharashtra',
          zip: '411001',
        },
        paymentMethod: 'Cash On Delivery',
        totalPrice: seededProducts[0].price,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      })
    }
  }
}

export const seedDefaultDataIfNeeded = async () => {
  const [productCount, userCount, categoryCount] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Category.countDocuments(),
  ])

  // Only trigger seed if any collection is completely empty
  if (productCount === 0 || userCount === 0 || categoryCount === 0) {
    await seedDefaultData()
    return { seeded: true }
  }

  return { seeded: false }
}
