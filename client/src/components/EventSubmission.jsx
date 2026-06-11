import React, { useState } from "react"
import axios from "axios"

function EventSubmission({ events, setEvents, user }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        category: 'Academic'
    })

    const API = import.meta.env.VITE_API_URL || ""

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!user) return alert('Please login first')
        
        const newEvent = {
            ...formData, 
            status: user.role === 'admin' ? 'approved' : 'pending', 
            submittedBy: user.email 
        }

        axios.post(`${API}/api/events`, newEvent, { withCredentials: true })
           .then(res => {
                setEvents([...events, res.data])
                setFormData({ title: '', date: '', description: '', category: 'Academic' })
                alert(user.role === 'admin' ? 'Event added' : 'Event submitted for approval')
            })
           .catch(err => console.error('Submit error:', err))
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    // Week 6: Add-to-Calendar - generates .ics file download
    const downloadICS = (event) => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${event.date.replace(/-/g, '')}
DESCRIPTION:${event.description || ''}
END:VEVENT
END:VCALENDAR`
        
        const blob = new Blob([icsContent], { type: 'text/calendar' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${event.title}.ics`
        a.click()
    }

    return React.createElement('div', { className: 'event-form' },
        React.createElement('h3', null, 'Event Submission Form'),
        React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('input', {
                type: 'text',
                name: 'title',
                placeholder: 'Event Title',
                value: formData.title,
                onChange: handleChange,
                required: true
            }),
            React.createElement('input', {
                type: 'date',
                name: 'date',
                value: formData.date,
                onChange: handleChange,
                required: true
            }),
            React.createElement('textarea', {
                name: 'description',
                placeholder: 'Description',
                value: formData.description,
                onChange: handleChange
            }),
            React.createElement('select', {
                name: 'category',
                value: formData.category,
                onChange: handleChange
            },
                React.createElement('option', { value: 'Academic' }, 'Academic'),
                React.createElement('option', { value: 'Social' }, 'Social'),
                React.createElement('option', { value: 'Sports' }, 'Sports')
            ),
            React.createElement('button', { type: 'submit' }, 'Submit Event')
        ),
        React.createElement('h4', null, 'Approved Events'),
        events.filter(e => e.status === 'approved').map(event =>
            React.createElement('div', { key: event._id },
                React.createElement('span', null, `${event.title} - ${event.date}`),
                React.createElement('button', { 
                    onClick: () => downloadICS(event) 
                }, 'Add to Calendar')
            )
        )
    )
}

export default EventSubmission
