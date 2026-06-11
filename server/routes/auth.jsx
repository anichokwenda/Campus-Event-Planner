import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashed, name, role: 'user' })
    await user.save()

    req.session.userId = user._id
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })

    req.session.userId = user._id
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get current user
router.get('/user', async (req, res) => {
  if (!req.session.userId) return res.json(null)
  const user = await User.findById(req.session.userId).select('-password')
  res.json(user)
})

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy()
  res.json({ message: 'Logged out' })
})

export default router
