import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Test route for Week 5
app.get('/api/events', (req, res) => {
  res.json([
    { 
      id: 1, 
      title: "Career Fair", 
      lat: -17.7814, 
      lng: 31.0587, 
      category: "career", 
      event_date: "2026-06-10" 
    },
    { 
      id: 2, 
      title: "Club Meeting", 
      lat: -17.7809, 
      lng: 31.0516, 
      category: "club", 
      event_date: "2026-06-11" 
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
