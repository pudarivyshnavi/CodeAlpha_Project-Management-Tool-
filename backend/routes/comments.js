const express = require('express');
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { commentValidation } = require('../middleware/validation');

router.route('/')
  .post(protect, commentValidation, addComment);

router.route('/task/:taskId')
  .get(protect, getComments);

router.route('/:id')
  .delete(protect, deleteComment);

module.exports = router;
