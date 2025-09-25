require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const csrf = require('csurf');

const passport = require('./config/passport'); // ✅ Passport setup

const app = express();

// ── Middleware: Body parsing & static files ──
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── View engine setup ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Session setup ──
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// ── Flash messages ──
app.use(flash());

// ── Passport (after session) ──
app.use(passport.initialize());
app.use(passport.session());

// ── CSRF Protection ──
app.use(csrf());

// ── Expose user, csrf token, and flash messages to views ──
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken();
  res.locals.message = req.flash('error');
  next();
});

// ── Routes ──
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/pages'));
app.use('/exercises', require('./routes/exercises'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/gyms', require('./routes/gyms'));
app.use('/gallery', require('./routes/gallery'));
app.use('/diet', require('./routes/diet'));
app.use('/videos', require('./routes/videos'));
app.use('/progress', require('./routes/progress'));
app.use('/about', require('./routes/about'));

// ── Serve React build (for frontend SPA) ──
app.use(express.static(path.join(__dirname, '../client/build')));

// ── Fallback to React for unknown routes ──
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/dashboard')) {
    return next(); // Let API routes/Express routes handle it
  }
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// ── 404 handler (for API/EJS routes only) ──
app.use((req, res) => {
  res.status(404).render('404', { user: req.user || null });
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('404', { user: req.user || null });
  } else {
    res.render('error', {
      message: err.message || 'Something went wrong.',
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  }
});

// ── Start server ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
