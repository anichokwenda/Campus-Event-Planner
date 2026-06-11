import React from "react"
import axios from "axios"

function AdminDashboard({ events, setEvents, user }) {
    const API = import.meta.env.VITE_API_URL || ""

    if (!user || user.role !== 'admin') return null

    const handleApprove = (id) => {
        axios.put(`${API}/api/events/${id}/approve`, {}, { withCredentials: true })
           .then(res => {
                setEvents(events.map(e => e._id === id ? res.data : e))
            })
           .catch(err => console.error('Approve error:', err))
    }

    const handleReject = (id) => {
        axios.delete(`${API}/api/events/${id}`, { withCredentials: true })
           .then(() => {
                setEvents(events.filter(e => e._id !== id))
            })
           .catch(err => console.error('Reject error:', err))
    }

    const pendingEvents = events.filter(e => e.status === 'pending')

    return React.createElement('div', { className: 'admin-dashboard' },
        React.createElement('h3', null, 'Admin Approval Dashboard'),
        React.createElement('p', null, `Pending: ${pendingEvents.length}`),
        pendingEvents.map(event =>
            React.createElement('div', { key: event._id, className: 'pending-event' },
                React.createElement('h4', null, event.title),
                React.createElement('p', null, `Date: ${event.date}`),
                React.createElement('p', null, `By: ${event.submittedBy}`),
                React.createElement('p', null, event.description),
                React.createElement('button', {
                    onClick: () => handleApprove(event._id)
                }, 'Approve'),
                React.createElement('button', {
                    onClick: () => handleReject(event._id)
                }, 'Reject')
            )
        )
    )
}

export default AdminDashboard
