const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllUsers);

router.route('/:id')
  .get(protect, getUserById);

router.route('/profile/update')
  .put(protect, updateProfile);

module.exports = router;
