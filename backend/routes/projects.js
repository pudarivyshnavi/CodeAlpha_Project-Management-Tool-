const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getActivityLogs,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { projectValidation } = require('../middleware/validation');

router.route('/')
  .post(protect, projectValidation, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.get('/:id/activity', protect, getActivityLogs);

module.exports = router;
