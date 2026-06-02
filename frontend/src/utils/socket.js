import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { userId },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinProject = (projectId) => {
  if (socket) {
    socket.emit('join-project', projectId);
  }
};

export const leaveProject = (projectId) => {
  if (socket) {
    socket.emit('leave-project', projectId);
  }
};

export const joinUserRoom = (userId) => {
  if (socket) {
    socket.emit('join-user', userId);
  }
};

export const onTaskCreated = (callback) => {
  if (socket) {
    socket.on('task-created', callback);
  }
};

export const onTaskUpdated = (callback) => {
  if (socket) {
    socket.on('task-updated', callback);
  }
};

export const onTaskDeleted = (callback) => {
  if (socket) {
    socket.on('task-deleted', callback);
  }
};

export const onTaskMoved = (callback) => {
  if (socket) {
    socket.on('task-moved', callback);
  }
};

export const onCommentAdded = (callback) => {
  if (socket) {
    socket.on('comment-added', callback);
  }
};

export const onNewNotification = (callback) => {
  if (socket) {
    socket.on('new-notification', callback);
  }
};

export const onProjectUpdated = (callback) => {
  if (socket) {
    socket.on('project-updated', callback);
  }
};

export const removeListener = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};
