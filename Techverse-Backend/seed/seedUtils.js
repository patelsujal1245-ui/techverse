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
  await Order.deleteMany()
  await Product.deleteMany()
  await Category.deleteMany()
  await User.deleteMany()

  const users = await User.insertMany(
    await Promise.all(
      defaultUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    ),
  )

  await Category.insertMany(defaultCategories)
  const products = await Product.insertMany(defaultProducts)

  const customer = users.find((user) => user.email === 'jane@techverse.com')
  if (customer && products.length) {
    await Order.create(buildOrderSeed(products, customer._id))
  }
}

export const seedDefaultDataIfNeeded = async () => {
  const [productCount, userCount, categoryCount] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Category.countDocuments(),
  ])

  if (
    productCount < defaultProducts.length ||
    userCount < defaultUsers.length ||
    categoryCount < defaultCategories.length
  ) {
    await seedDefaultData()
    return { seeded: true }
  }

  return { seeded: false }
}
