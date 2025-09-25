const express = require('express');
const router = express.Router();
const db = require('../config/db').promise();

// GET /diet — with optional filters
router.get('/', async (req, res) => {
    const { category, meal_time } = req.query;
    let query = 'SELECT * FROM diet_plans WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (meal_time) {
        query += ' AND meal_time = ?';
        params.push(meal_time);
    }

    try {
        const [plans] = await db.execute(query, params);
        res.render('diet', { user: req.user || null, plans });
    } catch (err) {
        console.error('❌ Diet fetch error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router; // ✅ Don't forget this
