const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    category: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedBy: String
})

