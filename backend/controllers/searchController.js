const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        results: {
          projects: [],
          tasks: [],
          users: [],
        },
      });
    }

    const searchRegex = new RegExp(query, 'i');

    // Search projects
    const projects = await Project.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
      ],
      $or: [
        { owner: req.user.id },
        { members: req.user.id },
      ],
    })
      .limit(10)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    // Search tasks
    const tasks = await Task.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
      ],
    })
      .limit(10)
      .populate('assignedTo', 'name email avatar')
      .populate('projectId', 'title')
      .populate('createdBy', 'name avatar');

    // Filter tasks by project membership
    const userProjectIds = projects.map((p) => p._id);
    const accessibleTasks = tasks.filter((task) =>
      userProjectIds.includes(task.projectId._id)
    );

    // Search users
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
      ],
    })
      .select('name email avatar role')
      .limit(10);

    res.json({
      success: true,
      results: {
        projects,
        tasks: accessibleTasks,
        users,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  globalSearch,
};
