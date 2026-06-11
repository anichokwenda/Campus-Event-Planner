// Run: node make-admin.js
// This will make the first user an admin
import fetch from 'node-fetch'
fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@test.com', password: 'admin123', name: 'Admin'})
}).then(r => r.json()).then(console.log)
