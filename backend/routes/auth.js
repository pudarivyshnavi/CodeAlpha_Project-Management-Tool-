const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, getProfile);

module.exports = router;
