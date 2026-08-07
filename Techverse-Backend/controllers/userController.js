import User from '../models/User.js'

export const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
}

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    user.address = req.body.address || user.address

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}
