# TaskFlow Pro Frontend

A modern React-based frontend for the TaskFlow Pro project management tool, built with Vite, Tailwind CSS, and Socket.io.

## Features

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
frontend/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.jsx      # Kanban board with drag and drop
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   └── TaskModal.jsx        # Task creation/editing modal
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state management
│   │   └── DarkModeContext.jsx # Dark mode state management
│   ├── pages/
│   │   ├── Dashboard.jsx        # Project dashboard
│   │   ├── Login.jsx            # Login page
│   │   ├── Notifications.jsx    # Notifications page
│   │   ├── ProjectBoard.jsx     # Project kanban board
│   │   ├── Register.jsx         # Registration page
│   │   └── Settings.jsx         # User settings
│   ├── utils/
│   │   ├── api.js               # Axios instance with interceptors
│   │   └── socket.js            # Socket.io utilities
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (optional):
```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

The frontend integrates with the backend API at `http://localhost:5000/api` by default. All API calls are handled through the `api.js` utility which includes:

- Automatic JWT token injection
- Token refresh on 401 errors
- Request/response interceptors

## Socket.io Events

### Client → Server
- `join-project` - Join a project room
- `leave-project` - Leave a project room
- `join-user` - Join user notification room

### Server → Client
- `task-created` - New task created
- `task-updated` - Task updated
- `task-deleted` - Task deleted
- `task-moved` - Task moved between columns
- `comment-added` - New comment added
- `new-notification` - New notification received
- `project-updated` - Project updated

## Pages

### Login (`/login`)
User authentication with email and password.

### Register (`/register`)
New user registration with name, email, and password.

### Dashboard (`/dashboard`)
- View all projects
- Create new projects
- See project progress and statistics
- Navigate to project boards

### Project Board (`/projects/:id`)
- Kanban board with Todo, In Progress, Done columns
- Drag and drop tasks between columns
- Create, edit, delete tasks
- Filter tasks by status and search
- Task details modal with comments

### Notifications (`/notifications`)
- View all notifications
- Mark as read/unread
- Delete notifications
- Real-time notification updates

### Settings (`/settings`)
- Update profile information
- View account details
- Manage user settings

## Components

### KanbanBoard
Drag-and-drop kanban board component using react-beautiful-dnd.

### TaskModal
Modal for creating and editing tasks with:
- Title and description
- Priority selection
- Deadline picker
- User assignment
- Comments section

### Sidebar
Responsive navigation sidebar with:
- Project navigation
- Dark mode toggle
- User profile
- Logout functionality

### Layout
Main layout wrapper that includes authentication check and sidebar.

## Context Providers

### AuthContext
Provides authentication state and methods:
- `user` - Current user data
- `loading` - Loading state
- `login` - Login method
- `register` - Register method
- `logout` - Logout method
- `checkAuth` - Check authentication status

### DarkModeContext
Provides dark mode state and toggle:
- `isDark` - Current dark mode state
- `toggleDarkMode` - Toggle dark mode

## Styling

The application uses Tailwind CSS with custom configurations:
- Primary color scheme (blue)
- Dark mode support
- Custom component classes in `index.css`

## Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly interactions

## Security

- JWT token storage in localStorage
- Automatic token refresh
- Protected routes
- Input validation on forms

## Development

The frontend is designed to be:
- Fast with Vite's HMR
- Modern with React 18 features
- Scalable with clean component structure
- Maintainable with clear separation of concerns
