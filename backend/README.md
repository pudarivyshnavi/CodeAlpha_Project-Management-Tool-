# TaskFlow Pro Backend

A production-ready backend for the TaskFlow Pro project management tool, built with Node.js, Express, MongoDB, and Socket.io.

## Features

- **Authentication**: JWT-based authentication with access and refresh tokens
- **Role-Based Access Control**: Admin and Member roles
- **Project Management**: Create, update, delete projects with member management
- **Task Management**: Kanban-style task boards with status, priority, deadlines, and assignments
- **Real-time Updates**: Socket.io integration for live task updates, comments, and notifications
- **Comments System**: Add comments with @mentions and threaded replies
- **Notifications**: Real-time notifications for task assignments, updates, and mentions
- **Activity Logging**: Track all user actions within projects
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Environment**: dotenv

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── projectController.js # Project CRUD operations
│   ├── taskController.js    # Task CRUD operations
│   ├── commentController.js # Comment operations
│   ├── notificationController.js # Notification operations
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js     # Error handling middleware
│   └── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User model
│   ├── Project.js           # Project model
│   ├── Task.js              # Task model
│   ├── Comment.js           # Comment model
│   ├── Notification.js      # Notification model
│   └── ActivityLog.js       # Activity log model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── projects.js          # Project routes
│   ├── tasks.js             # Task routes
│   ├── comments.js          # Comment routes
│   ├── notifications.js     # Notification routes
│   └── users.js             # User routes
├── socket/
│   └── socketHandler.js     # Socket.io event handlers
├── utils/
│   └── jwt.js               # JWT utility functions
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow-pro
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

3. Start MongoDB (ensure MongoDB is running on your system)

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Projects

- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project
- `GET /api/projects/:id/activity` - Get project activity logs

### Tasks

- `GET /api/tasks` - Get tasks (with optional filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `POST /api/tasks/reorder` - Reorder tasks

### Comments

- `POST /api/comments` - Add a comment
- `GET /api/comments/task/:taskId` - Get comments for a task
- `DELETE /api/comments/:id` - Delete a comment

### Notifications

- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:notificationId` - Mark notification as read
- `PATCH /api/notifications` - Mark all notifications as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile/update` - Update user profile

## Socket.io Events

### Client → Server Events

- `join-project` - Join a project room
- `leave-project` - Leave a project room
- `join-user` - Join user notification room
- `task-created` - Emit when task is created
- `task-updated` - Emit when task is updated
- `task-deleted` - Emit when task is deleted
- `task-moved` - Emit when task is moved between columns
- `comment-added` - Emit when comment is added
- `notification-triggered` - Trigger a notification
- `project-updated` - Emit when project is updated
- `member-added` - Emit when member is added
- `member-removed` - Emit when member is removed

### Server → Client Events

- `task-created` - Broadcast task creation to project members
- `task-updated` - Broadcast task update to project members
- `task-deleted` - Broadcast task deletion to project members
- `task-moved` - Broadcast task move to project members
- `comment-added` - Broadcast comment to project members
- `new-notification` - Send notification to specific user
- `project-updated` - Broadcast project update to members
- `member-added` - Broadcast member addition to project
- `member-removed` - Broadcast member removal from project

## Data Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (admin/member)
- projects: Array of Project references
- avatar: String
- refreshToken: String

### Project
- title: String
- description: String
- owner: User reference
- members: Array of User references
- tasks: Array of Task references
- color: String
- isPublic: Boolean
- shareLink: String

### Task
- title: String
- description: String
- status: String (todo/in-progress/done)
- priority: String (low/medium/high)
- deadline: Date
- assignedTo: User reference
- projectId: Project reference
- createdBy: User reference
- attachments: Array
- position: Number

### Comment
- text: String
- userId: User reference
- taskId: Task reference
- mentions: Array of User references
- parentId: Comment reference (for replies)

### Notification
- userId: User reference
- message: String
- type: String (task_assigned/task_updated/comment_added/deadline_changed/project_invited/mention)
- isRead: Boolean
- relatedProject: Project reference
- relatedTask: Task reference
- actionUrl: String

### ActivityLog
- userId: User reference
- action: String
- projectId: Project reference
- taskId: Task reference
- details: Object

## Security Features

- Password hashing with bcryptjs
- JWT access and refresh tokens
- Protected routes with authentication middleware
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable configuration

## Development

The backend is designed to be:
- Scalable with clean MVC architecture
- Production-ready with proper error handling
- Secure with authentication and authorization
- Real-time with Socket.io integration
- Well-documented with clear code structure

## License

ISC
