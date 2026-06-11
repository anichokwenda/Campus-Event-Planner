const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    description: String,
    category: String,
    status: { type: String, default: 'pending' },
    submittedBy: String
})

