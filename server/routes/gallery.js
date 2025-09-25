const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('gallery', { 
        user: req.user,
        title: 'Fitness Gallery'
    });
});

module.exports = router;