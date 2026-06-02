const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

const addComment = async (req, res) => {
  try {
    const { text, taskId, mentions, parentId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    const comment = await Comment.create({
      text,
      userId: req.user.id,
      taskId,
      mentions: mentions || [],
      parentId: parentId || null,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name email avatar')
      .populate('mentions', 'name email');

    await ActivityLog.create({
      userId: req.user.id,
      action: 'commented on task',
      projectId: project._id,
      taskId: task._id,
      details: { taskTitle: task.title, commentText: text },
    });

    if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
      await Notification.create({
        userId: task.assignedTo,
        message: `${req.user.name} commented on task: ${task.title}`,
        type: 'comment_added',
        relatedProject: project._id,
        relatedTask: task._id,
      });
    }

    if (mentions && mentions.length > 0) {
      for (const mentionId of mentions) {
        if (mentionId.toString() !== req.user.id) {
          await Notification.create({
            userId: mentionId,
            message: `${req.user.name} mentioned you in a comment`,
            type: 'mention',
            relatedProject: project._id,
            relatedTask: task._id,
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view comments on this task' });
    }

    const comments = await Comment.find({ taskId, parentId: null })
      .populate('userId', 'name email avatar')
      .populate('mentions', 'name email')
      .sort({ createdAt: -1 });

    const replies = await Comment.find({ taskId, parentId: { $ne: null } })
      .populate('userId', 'name email avatar')
      .populate('mentions', 'name email')
      .sort({ createdAt: 1 });

    res.json({ success: true, comments, replies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
