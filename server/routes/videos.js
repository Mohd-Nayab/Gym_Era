const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('videos', { 
        user: req.user,
        title: 'Exercise Videos'
    });
});

module.exports = router;