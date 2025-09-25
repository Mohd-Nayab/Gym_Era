const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const db = require('../config/db').promise(); // MySQL2/promise

// ── CONSTANTS ────────────────────────────────
const SALT_ROUNDS = 12;

// ── RATE LIMITING ────────────────────────────
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts. Please try again in 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// ── REGISTER GET ─────────────────────────────
router.get('/register', (req, res) => {
    res.render('register', {
        message: null,
        csrfToken: req.csrfToken(),
        user: req.user || null
    });
});

// ── REGISTER POST ────────────────────────────
router.post('/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const { username, email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.render('register', {
                message: errors.array()[0].msg,
                csrfToken: req.csrfToken(),
                user: req.user || null
            });
        }

        try {
            const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return res.render('register', {
                    message: 'Email already registered',
                    csrfToken: req.csrfToken(),
                    user: req.user || null
                });
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            await db.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );

            res.redirect('/login');
        } catch (err) {
            console.error('❌ Registration error:', err);
            res.render('register', {
                message: 'Registration failed. Please try again.',
                csrfToken: req.csrfToken(),
                user: req.user || null
            });
        }
    }
);

// ── LOGIN GET ────────────────────────────────
router.get('/login', (req, res) => {
    const messages = req.flash('error');
    res.render('login', {
        message: messages.length > 0 ? messages[0] : null,
        csrfToken: req.csrfToken(),
        user: req.user || null
    });
});

// ── LOGIN POST ───────────────────────────────
router.post('/login', loginLimiter, (req, res, next) => {
    console.log('📧 Login attempt with:', req.body);

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('❌ Passport error:', err);
            return next(err);
        }
        if (!user) {
            console.log('❌ Authentication failed:', info.message);
            req.flash('error', info.message || 'Invalid credentials');
            return res.redirect('/login');
        }

        console.log('✅ User authenticated:', user.username);

        req.logIn(user, (err) => {
            if (err) {
                console.error('❌ Session login error:', err);
                return next(err);
            }
            console.log('✅ User session established');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

// ── LOGOUT ───────────────────────────────────
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;
