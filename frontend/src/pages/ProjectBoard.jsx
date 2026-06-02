import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { initSocket, joinProject, leaveProject, onTaskCreated, onTaskUpdated, onTaskDeleted, onTaskMoved, onCommentAdded, removeListener } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import { ArrowLeft, Search, Filter, Plus } from 'lucide-react';
import TaskModal from '../components/TaskModal';

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState(null);

  useEffect(() => {
    fetchProject();
    fetchTasks();

    if (user) {
      const socket = initSocket(user.id);
      joinProject(id);

      onTaskCreated((data) => {
        if (data.projectId === id) {
          setTasks((prev) => [...prev, data]);
        }
      });

      onTaskUpdated((data) => {
        if (data.projectId === id) {
          setTasks((prev) => prev.map((task) => (task._id === data._id ? data : task)));
        }
      });

      onTaskDeleted((data) => {
        if (data.projectId === id) {
          setTasks((prev) => prev.filter((task) => task._id !== data.taskId));
        }
      });

      onTaskMoved((data) => {
        if (data.projectId === id) {
          setTasks((prev) => prev.map((task) => (task._id === data.taskId ? { ...task, status: data.status, position: data.position } : task)));
        }
      });

      onCommentAdded((data) => {
        if (data.projectId === id && editingTask?._id === data.taskId) {
          // Refresh task modal comments if open
          if (showTaskModal) {
            setEditingTask((prev) => prev ? { ...prev } : prev);
          }
        }
      });

      return () => {
        leaveProject(id);
        removeListener('task-created');
        removeListener('task-updated');
        removeListener('task-deleted');
        removeListener('task-moved');
        removeListener('comment-added');
      };
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks', { params: { projectId: id } });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = async (taskId, newStatus, newIndex) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus, position: newIndex });
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus, position: newIndex } : task
        )
      );
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const handleCreateTask = (status) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskStatus(null);
    setShowTaskModal(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        await api.post('/tasks', { ...taskData, status: newTaskStatus, projectId: id });
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setNewTaskStatus(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setShowTaskModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Project not found</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
          </div>
        </div>
        <button
          onClick={() => handleCreateTask('todo')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <KanbanBoard
        tasks={filteredTasks}
        onTaskMove={handleTaskMove}
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
      />

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projectId={id}
          projectMembers={project.members}
          onSave={handleTaskSave}
          onDelete={handleTaskDelete}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
            setNewTaskStatus(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
