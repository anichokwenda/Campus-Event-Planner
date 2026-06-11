import React, { useState } from "react"
import axios from "axios"

function Auth({ user, setUser }) {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })

    const API = import.meta.env.VITE_API_URL || ""

    const handleSubmit = (e) => {
        e.preventDefault()
        const url = isLogin ? `${API}/auth/login` : `${API}/auth/register`
        
        axios.post(url, formData, { withCredentials: true })
            .then(res => {
                setUser(res.data.user)
                setFormData({ email: '', password: '', name: '' })
            })
            .catch(err => alert(err.response?.data?.error || 'Auth failed'))
    }

    const handleLogout = () => {
        axios.post(`${API}/auth/logout`, {}, { withCredentials: true })
            .then(() => setUser(null))
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }

    if (user) {
        return React.createElement('div', { className: 'auth-bar' },
            React.createElement('span', null, `Logged in: ${user.name} ${user.role === 'admin' ? '(Admin)' : ''}`),
            React.createElement('button', { onClick: handleLogout }, 'Logout')
        )
    }

    return React.createElement('div', { className: 'auth-box' },
        React.createElement('h3', null, isLogin ? 'Login' : 'Register'),
        React.createElement('form', { onSubmit: handleSubmit },
            !isLogin ? React.createElement('input', {
                type: 'text',
                name: 'name',
                placeholder: 'Name',
                value: formData.name,
                onChange: handleChange,
                required: true
            }) : null,
            React.createElement('input', {
                type: 'email',
                name: 'email',
                placeholder: 'Email',
                value: formData.email,
                onChange: handleChange,
                required: true
            }),
            React.createElement('input', {
                type: 'password',
                name: 'password',
                placeholder: 'Password',
                value: formData.password,
                onChange: handleChange,
                required: true
            }),
            React.createElement('button', { type: 'submit' }, isLogin ? 'Login' : 'Register'),
            React.createElement('button', { 
                type: 'button', 
                onClick: () => setIsLogin(!isLogin) 
            }, isLogin ? 'Need to register?' : 'Have an account?')
        )
    )
}

export default Auth
