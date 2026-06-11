import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'user' } // 'user' or 'admin'
})

export default mongoose.model('User', userSchema)
