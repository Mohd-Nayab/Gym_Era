const express = require('express');
const router = express.Router();

// Middleware: Protect route — only for logged-in users
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please log in to access dashboard');
    res.redirect('/login');
}

// GET /dashboard
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user,
        title: 'Your Dashboard'
    });
});

module.exports = router;