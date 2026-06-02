const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo, projectId, status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to add tasks to this project' });
    }

    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser || !project.members.includes(assignedTo)) {
        return res.status(400).json({ message: 'Invalid assigned user' });
      }
    }

    const taskCount = await Task.countDocuments({ projectId, status: status || 'todo' });
    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'todo',
      deadline,
      assignedTo: assignedTo || null,
      projectId,
      createdBy: req.user.id,
      position: taskCount,
    });

    project.tasks.push(task._id);
    await project.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'created task',
      projectId: project._id,
      taskId: task._id,
      details: { taskTitle: title },
    });

    if (assignedTo && assignedTo.toString() !== req.user.id) {
      await Notification.create({
        userId: assignedTo,
        message: `You have been assigned to task: ${title}`,
        type: 'task_assigned',
        relatedProject: project._id,
        relatedTask: task._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status, assignedTo } = req.query;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const query = { projectId };
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name avatar')
      .sort({ position: 1, createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name avatar')
      .populate('projectId', 'title');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, deadline, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;
    if (assignedTo !== undefined) {
      if (assignedTo && !project.members.includes(assignedTo)) {
        return res.status(400).json({ message: 'Invalid assigned user' });
      }
      task.assignedTo = assignedTo;
    }

    await task.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'updated task',
      projectId: project._id,
      taskId: task._id,
      details: { 
        taskTitle: task.title,
        changes: {
          status: oldStatus !== status ? { from: oldStatus, to: status } : undefined,
          assignedTo: oldAssignedTo?.toString() !== assignedTo?.toString() ? { from: oldAssignedTo, to: assignedTo } : undefined,
        },
      },
    });

    if (assignedTo && assignedTo.toString() !== req.user.id && oldAssignedTo?.toString() !== assignedTo.toString()) {
      await Notification.create({
        userId: assignedTo,
        message: `You have been assigned to task: ${task.title}`,
        type: 'task_assigned',
        relatedProject: project._id,
        relatedTask: task._id,
      });
    }

    res.json({ success: true, message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    project.tasks = project.tasks.filter(t => t.toString() !== task._id.toString());
    await project.save();

    await task.deleteOne();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'deleted task',
      projectId: project._id,
      details: { taskTitle: task.title },
    });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, position } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const oldStatus = task.status;
    task.status = status;
    if (position !== undefined) task.position = position;

    await task.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'moved task',
      projectId: project._id,
      taskId: task._id,
      details: { taskTitle: task.title, from: oldStatus, to: status },
    });

    res.json({ success: true, message: 'Task status updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    for (const item of tasks) {
      await Task.findByIdAndUpdate(item.id, { position: item.position });
    }

    res.json({ success: true, message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  reorderTasks,
};
