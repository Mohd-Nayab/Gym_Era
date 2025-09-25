const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('progress', { 
        user: req.user,
        title: 'Progress Tracker'
    });
});

module.exports = router;