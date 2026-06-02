const Notification = require('../models/Notification');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on('leave-project', (projectId) => {
      socket.leave(projectId);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    socket.on('join-user', (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined user room ${userId}`);
    });

    socket.on('task-created', (data) => {
      io.to(data.projectId).emit('task-created', data);
    });

    socket.on('task-updated', (data) => {
      io.to(data.projectId).emit('task-updated', data);
    });

    socket.on('task-deleted', (data) => {
      io.to(data.projectId).emit('task-deleted', data);
    });

    socket.on('task-moved', (data) => {
      io.to(data.projectId).emit('task-moved', data);
    });

    socket.on('comment-added', (data) => {
      io.to(data.projectId).emit('comment-added', data);
    });

    socket.on('notification-triggered', async (data) => {
      const { userId, message, type, relatedProject, relatedTask } = data;
      
      const notification = await Notification.create({
        userId,
        message,
        type,
        relatedProject,
        relatedTask,
      });

      io.to(userId).emit('new-notification', notification);
    });

    socket.on('project-updated', (data) => {
      io.to(data.projectId).emit('project-updated', data);
    });

    socket.on('member-added', (data) => {
      io.to(data.projectId).emit('member-added', data);
    });

    socket.on('member-removed', (data) => {
      io.to(data.projectId).emit('member-removed', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;
