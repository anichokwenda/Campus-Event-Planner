import express from 'express'
import Event from '../models/Event.js'
import User from '../models/User.js'

const router = express.Router()

// Middleware to check login
const requireAuth = async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Login required' })
    req.user = await User.findById(req.session.userId)
    next()
}

// Middleware to check admin
const requireAdmin = async (req, res, next) => {
    await requireAuth(req, res, () => {})
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
    next()
}

// Week 5: GET - show only approved to guests, all to admin
router.get('/', async (req, res) => {
  try {
    const user = req.session.userId ? await User.findById(req.session.userId) : null
    const query = user?.role === 'admin' ? {} : { status: 'approved' }
    const events = await Event.find(query)
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Week 6: POST - anyone logged in can submit
router.post('/', requireAuth, async (req, res) => {
  try {
    const event = new Event(req.body)
    await event.save()
    res.status(201).json(event)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Week 6: Approve - admin only
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Week 6: Delete - admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router


