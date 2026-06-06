import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:[
    "http://localhost:5173",
    "https://campus-event-planner.onrender.com"
  ]
}));
app.use(express.json());

// Test route for Week 5
app.get('/api/events', (req, res) => {
  res.json([
    { 
      id: 1, 
      title: "Career Fair", 
      lat: -17.781, 
      lng: 31.058, 
      category: "Career", 
      date: "2026-06-10" 
    },
    { 
      id: 2, 
      title: "Club Meeting", 
      lat: -17.780, 
      lng: 31.051, 
      category: "Club", 
      date: "2026-06-11" 
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
