import React, { useState } from "react"
import axios from "axios"

function EventSubmission({ events, setEvents, user }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        category: 'Academic',
        lat: '', // ADD
        lng: '' // ADD
    })

    const API = import.meta.env.VITE_API_URL || ""

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!user) return alert('Please login first')

        // Convert lat/lng to numbers
        const newEvent = {
           ...formData,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            status: user.role === 'admin'? 'approved' : 'pending',
            submittedBy: user.email
        }

        // Basic validation
        if (isNaN(newEvent.lat) || isNaN(newEvent.lng)) {
            return alert('Please enter valid latitude and longitude')
        }

        axios.post(`${API}/api/events`, newEvent, { withCredentials: true })
          .then(res => {
                setEvents([...events, res.data])
                setFormData({
                    title: '',
                    date: '',
                    description: '',
                    category: 'Academic',
                    lat: '',
                    lng: ''
                })
                alert(user.role === 'admin'? 'Event added' : 'Event submitted for approval')
            })
          .catch(err => console.error('Submit error:', err))
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    // Week 6: Add-to-Calendar - generates.ics file download
    const downloadICS = (event) => {
        const dtStart = event.date.replace(/-/g, '')
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${dtStart}
DESCRIPTION:${event.description || ''}
LOCATION:${event.lat}, ${event.lng}
END:VEVENT
END:VCALENDAR`

        const blob = new Blob([icsContent], { type: 'text/calendar' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${event.title}.ics`
        a.click()
    }

    return (
        <div className='event-form'>
            <h3>Event Submission Form</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='title'
                    placeholder='Event Title'
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name='description'
                    placeholder='Description'
                    value={formData.description}
                    onChange={handleChange}
                />
                <select
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value='Academic'>Academic</option>
                    <option value='Social'>Social</option>
                    <option value='Sports'>Sports</option>
                    <option value='Career'>Career</option>
                    <option value='Club'>Club</option>
                </select>
                {/* ADD THESE 2 INPUTS */}
                <input
                    type='number'
                    step='any'
                    name='lat'
                    placeholder='Latitude e.g. -17.781'
                    value={formData.lat}
                    onChange={handleChange}
                    required
                />
                <input
                    type='number'
                    step='any'
                    name='lng'
                    placeholder='Longitude e.g. 31.058'
                    value={formData.lng}
                    onChange={handleChange}
                    required
                />
                <button type='submit'>Submit Event</button>
            </form>

            <h4>Approved Events</h4>
            {events.filter(e => e.status === 'approved').map(event =>
                <div key={event._id}>
                    <span>{event.title} - {event.date} - {event.lat}, {event.lng}</span>
                    <button onClick={() => downloadICS(event)}>
                        Add to Calendar
                    </button>
                </div>
            )}
        </div>
    )
}

export default EventSubmission
