const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Guard registration and login with brute-force rate limiter
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);

module.exports = router;
