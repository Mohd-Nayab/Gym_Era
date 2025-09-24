// server/routes/gyms.js
const express = require('express');
const router = express.Router();

// Example gym data (if no DB, use static array for now)
const gyms = [
  { id: 1, name: 'FitZone Gym', city: 'New York', address: '123 Main St', rating: 4.5 },
  { id: 2, name: 'Muscle Factory', city: 'Boston', address: '456 Elm St', rating: 4.2 },
  // Add more gyms
];

// GET /gyms/search?query=cityName or /gyms/search?query=gymName
router.get('/search', (req, res) => {
  const searchQuery = req.query.query?.toLowerCase() || '';
  // Filter gyms based on name or city
  const results = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery) ||
    gym.city.toLowerCase().includes(searchQuery)
  );
  res.json(results);
});

module.exports = router;
