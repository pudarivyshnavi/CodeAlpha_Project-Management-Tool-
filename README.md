# TaskFlow Pro

A full-stack project management tool similar to Trello/Asana, built with modern technologies and featuring real-time collaboration.

## Features

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT-based auth with access/refresh tokens
- **Role-Based Access Control**: Admin and Member roles
- **Project Management**: Create, update, delete projects with member management
- **Task Management**: Kanban-style tasks with status, priority, deadlines, and assignments
- **Comments System**: Add comments with @mentions and threaded replies
- **Notifications**: Real-time notifications for task assignments, updates, and mentions
- **Activity Logging**: Track all user actions within projects
- **Real-time Updates**: Socket.io integration for live collaboration
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling middleware

### Frontend (React + Vite + Tailwind CSS)
- **Authentication**: Login and register with JWT tokens
- **Dashboard**: Project overview with progress tracking
- **Kanban Board**: Drag-and-drop task management with Todo, In Progress, and Done columns
- **Task Management**: Create, edit, delete tasks with priority, deadlines, and assignments
- **Comments**: Real-time commenting system on tasks
- **Notifications**: Real-time notifications for task updates, assignments, and mentions
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly UI with sidebar navigation
- **Real-time Updates**: Socket.io integration for live collaboration

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Environment**: dotenv

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Drag & Drop**: react-beautiful-dnd
- **State Management**: React Context API

## Project Structure

```
taskflow-pro/
├── backend/                      # Node.js/Express backend
│   ├── config/
│   │   └── database.js           # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── projectController.js  # Project CRUD operations
│   │   ├── taskController.js     # Task CRUD operations
│   │   ├── commentController.js  # Comment management
│   │   ├── notificationController.js # Notification handling
│   │   ├── userController.js     # User management
│   │   └── searchController.js   # Global search functionality
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication & authorization
│   │   ├── errorHandler.js       # Centralized error handling
│   │   └── validation.js         # Input validation rules
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Project.js            # Project schema
│   │   ├── Task.js               # Task schema
│   │   ├── Comment.js            # Comment schema
│   │   ├── Notification.js       # Notification schema
│   │   └── ActivityLog.js        # Activity log schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── projects.js           # Project routes
│   │   ├── tasks.js              # Task routes
│   │   ├── comments.js           # Comment routes
│   │   ├── notifications.js      # Notification routes
│   │   ├── users.js              # User routes
│   │   ├── upload.js             # File upload routes
│   │   └── search.js             # Search routes
│   ├── socket/
│   │   └── socketHandler.js     # Socket.io event handlers
│   ├── utils/
│   │   └── jwt.js                # JWT token generation & verification
│   ├── uploads/                  # File upload directory (gitignored)
│   ├── server.js                 # Express app & Socket.io server
│   ├── package.json              # Backend dependencies
│   ├── .env.example             # Environment variables template
│   └── .gitignore               # Git ignore file
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── KanbanBoard.jsx   # Drag-and-drop kanban board
│   │   │   ├── Layout.jsx        # Main layout wrapper
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── TaskModal.jsx     # Task creation/editing modal
│   │   │   ├── ActivityLog.jsx   # Project activity timeline
│   │   │   └── GlobalSearch.jsx  # Global search component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state management
│   │   │   └── DarkModeContext.jsx # Dark mode state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Project dashboard
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Notifications.jsx  # Notifications page
│   │   │   ├── ProjectBoard.jsx   # Project kanban board
│   │   │   ├── Register.jsx       # Registration page
│   │   │   └── Settings.jsx       # User settings
│   │   ├── utils/
│   │   │   ├── api.js            # Axios instance with interceptors
│   │   │   └── socket.js         # Socket.io utilities
│   │   ├── App.jsx               # React Router setup
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind styles
│   ├── index.html                # Root HTML
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .gitignore               # Git ignore file
│   └── README.md                # Frontend documentation
├── .gitignore                   # Root git ignore file
└── README.md                    # Project documentation
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow-pro
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start MongoDB (ensure MongoDB is running on your system)

5. Start the backend server:
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with your credentials at `/login`
3. **Create Project**: From the dashboard, click "New Project" to create your first project
4. **Add Tasks**: Navigate to a project board and add tasks to the Todo column
5. **Manage Tasks**: Drag tasks between columns, edit details, assign users, set deadlines
6. **Collaborate**: Add comments, mention team members, and see real-time updates

## API Documentation

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

### Tasks
- `GET /api/tasks` - Get tasks (with optional filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Comments
- `POST /api/comments` - Add a comment
- `GET /api/comments/task/:taskId` - Get comments for a task
- `DELETE /api/comments/:id` - Delete a comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:notificationId` - Mark notification as read
- `PATCH /api/notifications` - Mark all notifications as read
- `DELETE /api/notifications/:notificationId` - Delete notification

See `backend/README.md` for complete API documentation.

## Socket.io Events

### Client → Server Events
- `join-project` - Join a project room
- `leave-project` - Leave a project room
- `join-user` - Join user notification room

### Server → Client Events
- `task-created` - Broadcast task creation to project members
- `task-updated` - Broadcast task update to project members
- `task-deleted` - Broadcast task deletion to project members
- `task-moved` - Broadcast task move to project members
- `comment-added` - Broadcast comment to project members
- `new-notification` - Send notification to specific user
- `project-updated` - Broadcast project update to members

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite for HMR
```

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with your preferred server
```

## Security Features

- Password hashing with bcryptjs
- JWT access and refresh tokens
- Protected routes with authentication middleware
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable configuration

## License

ISC

## Contributing

This is a demonstration project for educational purposes. Feel free to fork and modify for your own use.
