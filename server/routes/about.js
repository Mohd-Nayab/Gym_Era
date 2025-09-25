// server/routes/about.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('about', {
        title: 'About - Gym_Era',
        user: req.user || null
    });
});

module.exports = router;