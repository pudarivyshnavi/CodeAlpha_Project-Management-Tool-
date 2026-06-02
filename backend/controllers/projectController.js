const Project = require('../models/Project');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const createProject = async (req, res) => {
  try {
    const { title, description, color } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id],
      color: color || '#3B82F6',
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id },
    });

    await ActivityLog.create({
      userId: req.user.id,
      action: 'created project',
      projectId: project._id,
      details: { projectName: title },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id },
      ],
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, color } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can update' });
    }

    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    project.color = color || project.color;

    await project.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'updated project',
      projectId: project._id,
      details: { projectName: title || project.title },
    });

    res.json({ success: true, message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can delete' });
    }

    await User.updateMany(
      { _id: { $in: project.members } },
      { $pull: { projects: project._id } }
    );

    await project.deleteOne();

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    await User.findByIdAndUpdate(userToAdd._id, {
      $push: { projects: project._id },
    });

    await ActivityLog.create({
      userId: req.user.id,
      action: 'added member',
      projectId: project._id,
      details: { memberName: userToAdd.name, memberEmail: email },
    });

    res.json({ success: true, message: 'Member added successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can remove members' });
    }

    if (userId === project.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { projects: project._id },
    });

    res.json({ success: true, message: 'Member removed successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const logs = await ActivityLog.find({ projectId: project._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getActivityLogs,
};
