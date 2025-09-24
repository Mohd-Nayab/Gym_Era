const express = require('express');
const db = require('../config/db').promise();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM exercises');
        res.render('exercises', { 
            exercises: JSON.stringify(rows) // ✅ Stringify ONCE here
        });
    } catch (error) {
        console.error('❌ DB Error:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;