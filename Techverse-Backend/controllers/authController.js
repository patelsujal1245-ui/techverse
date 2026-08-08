import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import nodemailer from 'nodemailer'
import OTPModel from '../models/OTP.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"TechVerse Security" <${process.env.SMTP_USER || 'no-reply@techverse.com'}>`,
      to: email,
      subject: 'TechVerse Verification Code (OTP)',
      text: `Your TechVerse verification code is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #7c3aed; text-align: center;">TechVerse Security</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Hello,</p>
          <p>We received a request to verify your email address. Please use the following One-Time Password (OTP) to proceed:</p>
          <div style="font-size: 2.2rem; font-weight: bold; text-align: center; letter-spacing: 0.1em; margin: 30px 0; color: #111;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 0.85rem;">This code will expire in 5 minutes. If you did not request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 0.8rem; color: #999; text-align: center;">TechVerse Retail Hub Inc.</p>
        </div>
      `
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions)
      console.log(`[SMTP] Verification email sent to ${email}`)
    } else {
      console.log(`\n-----------------------------------------`)
      console.log(`[MOCK EMAIL NOTIFICATION]`)
      console.log(`To: ${email}`)
      console.log(`Subject: TechVerse Verification OTP`)
      console.log(`Verification OTP Code: ${otp}`)
      console.log(`-----------------------------------------\n`)
    }
  } catch (error) {
    console.error('SMTP sending error. Falling back to console logging.', error)
    console.log(`\n-----------------------------------------`)
    console.log(`[FALLBACK LOG] Verification OTP for ${email}: ${otp}`)
    console.log(`-----------------------------------------\n`)
  }
}

export const sendOTP = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  // Generate 6-digit random code
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Save in database (overwrite if existing OTP)
  await OTPModel.deleteMany({ email })
  await OTPModel.create({ email, otp })

  // Send email
  await sendOTPEmail(email, otp)

  res.json({ message: 'OTP sent successfully. Check your email or console logs.' })
}

export const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({ message: 'Invalid user data' })
  }
}

export const registerWithOTP = async (req, res) => {
  const { name, email, password, phone, address, otp } = req.body
  
  const record = await OTPModel.findOne({ email, otp })
  if (!record) {
    return res.status(400).json({ message: 'Invalid or expired OTP code' })
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' })
  }

  // Delete used OTP
  await OTPModel.deleteMany({ email })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({ message: 'Invalid user data' })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(401).json({ message: 'Invalid email or password' })
  }
}

export const loginWithOTP = async (req, res) => {
  const { email, otp } = req.body
  const record = await OTPModel.findOne({ email, otp })

  if (!record) {
    return res.status(400).json({ message: 'Invalid or expired OTP code' })
  }

  // Delete used OTP
  await OTPModel.deleteMany({ email })

  const user = await User.findOne({ email })
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(404).json({ message: 'User record not found' })
  }
}

export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      role: req.user.role,
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}
