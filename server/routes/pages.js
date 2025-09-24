// server/routes/pages.js

const express = require('express');
const router = express.Router();

// 👇 Home Page
router.get('/', (req, res) => {
    res.render('home', { 
        title: 'Welcome to Gym_Era'
    });
});

// 👇 BMI Page
router.get('/bmi', (req, res) => {
    res.render('bmi', { 
        title: 'BMI Calculator'
    });
});

// 👇 Posture Page
router.get('/posture', (req, res) => {
    res.render('posture', { 
        title: 'Fix Your Posture'
    });
});

// 👇 Any other static pages...

module.exports = router;