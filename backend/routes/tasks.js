const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  reorderTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidation } = require('../middleware/validation');

router.route('/')
  .post(protect, taskValidation, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);
router.post('/reorder', protect, reorderTasks);

module.exports = router;
