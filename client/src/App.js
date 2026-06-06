import { useState, useEffect } from "react"
import Map from "./components/Map.js"
import EventFilter from "./components/EventFilter.js"
import axios from "axios"
import "./App.css"

function App() {
    const [events, setEvents] = useState([])
    const [filters, setFilters] = useState({
        category: "All",
        date: "All"
    })

    useEffect(() =>{
        axios.get("/api/events")
           .then(res => setEvents(res.data))
           .catch(err => console.error("Error fetching events:", err))
    }, [])

    return(
        <div className="app">
            <h1>Campus Event Planner</h1>
            <EventFilter filters={filters} setFilters={setFilters} />
            <Map events={events} filters={filters} />
        </div>
    )
}

export default App