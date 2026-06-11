import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bcrypt from 'bcrypt'

const app = express()
const PORT = process.env.PORT || 3000

// Week 5 CORS - keeping your exact origins
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", // fixed your typo: was missing :
    "https://campus-event-planner-client.onrender.com"
  ],
  credentials: true
}))
app.use(express.json())

// Week 6: Session for inbuilt auth
app.use(session({
    secret: 'week6-secret-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set true if using https
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}))

// In-memory DB for Week 6 - replace with MongoDB later
let users = []
let events = [
    {
      _id: "1",
      title: "Career Fair",
      lat: -17.781,
      lng: 31.058,
      category: "Career",
      date: "2026-06-10",
      description: "Meet employers",
      status: "approved",
      submittedBy: "admin@test.com"
    },
    {
      _id: "2",
      title: "Club Meeting",
      lat: -17.780,
      lng: 31.051,
      category: "Club",
      date: "2026-06-11",
      description: "Monthly club meetup",
      status: "approved",
      submittedBy: "admin@test.com"
    }
]
let nextUserId = 1
let nextEventId = 3

// Middleware: check if logged in
const requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Login required' })
    req.user = users.find(u => u.id === req.session.userId)
    if (!req.user) return res.status(401).json({ error: 'User not found' })
    next()
}

// Middleware: check if admin
const requireAdmin = (req, res, next) => {
    requireAuth(req, res, () => {
        if (req.user.role!== 'admin') return res.status(403).json({ error: 'Admin only' })
        next()
    })
}

// ===== WEEK 6: AUTH ROUTES =====

// Register
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already exists' })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = {
            id: String(nextUserId++),
            email,
            password: hashed,
            name,
            role: 'user'
        }
        users.push(user)
        req.session.userId = user.id
        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = users.find(u => u.email === email)
        if (!user) return res.status(400).json({ error: 'Invalid credentials' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ error: 'Invalid credentials' })

        req.session.userId = user.id
        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get current user
app.get('/auth/user', (req, res) => {
    if (!req.session.userId) return res.json(null)
    const user = users.find(u => u.id === req.session.userId)
    if (!user) return res.json(null)
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role })
})

// Logout
app.post('/auth/logout', (req, res) => {
    req.session.destroy()
    res.json({ message: 'Logged out' })
})

// ===== WEEK 5 + WEEK 6: EVENTS ROUTES =====

// Week 5: GET all events - modified to filter by status for non-admins
app.get('/api/events', (req, res) => {
    const user = req.session.userId? users.find(u => u.id === req.session.userId) : null
    // Admin sees all, others see only approved
    const filtered = user?.role === 'admin'
       ? events
        : events.filter(e => e.status === 'approved')
    res.json(filtered)
})

// Week 6: POST new event - anyone logged in
app.post('/api/events', requireAuth, (req, res) => {
    const newEvent = {
        _id: String(nextEventId++),
       ...req.body,
        status: req.user.role === 'admin'? 'approved' : 'pending',
        submittedBy: req.user.email
    }
    events.push(newEvent)
    res.status(201).json(newEvent)
})

// Week 6: PUT approve event - admin only
app.put('/api/events/:id/approve', requireAdmin, (req, res) => {
    const event = events.find(e => e._id === req.params.id)
    if (!event) return res.status(404).json({ error: 'Event not found' })
    event.status = 'approved'
    res.json(event)
})

// Week 6: PUT update event - admin only
app.put('/api/events/:id', requireAdmin, (req, res) => {
    const idx = events.findIndex(e => e._id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Event not found' })
    events[idx] = {...events[idx],...req.body }
    res.json(events[idx])
})

// Week 6: DELETE event - admin only
app.delete('/api/events/:id', requireAdmin, (req, res) => {
    const idx = events.findIndex(e => e._id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Event not found' })
    events.splice(idx, 1)
    res.json({ message: 'Deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

