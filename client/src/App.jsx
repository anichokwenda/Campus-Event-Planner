import { useState, useEffect } from "react"
import Map from "./components/Map.jsx"
import EventFilter from "./components/EventFilter.jsx"
import Auth from "./components/Auth.jsx" // ADD
import EventSubmission from "./components/EventSubmission.jsx" // ADD
import AdminDashboard from "./components/AdminDashboard.jsx" // ADD
import axios from "axios"
import "./App.css"

function App() {
    const [events, setEvents] = useState([])
    const [filters, setFilters] = useState({ category: "All", date: "All" })
    const [user, setUser] = useState(null) // ADD

    const API = import.meta.env.VITE_API_URL || ""

    useEffect(() =>{
        axios.get(`${API}/api/events`, { withCredentials: true })
          .then(res => setEvents(res.data))
          .catch(err => console.error("Error fetching events:", err))

        axios.get(`${API}/auth/user`, { withCredentials: true })
          .then(res => setUser(res.data))
          .catch(() => setUser(null))
    }, [])

    return(
        <div className="app">
            <h1>Campus Event Planner</h1>
            <Auth user={user} setUser={setUser} /> {/* ADD */}
            <EventFilter filters={filters} setFilters={setFilters} />
            <Map events={events} filters={filters} />
            <EventSubmission events={events} setEvents={setEvents} user={user} /> {/* ADD */}
            <AdminDashboard events={events} setEvents={setEvents} user={user} /> {/* ADD */}
        </div>
    )
}

export default App
