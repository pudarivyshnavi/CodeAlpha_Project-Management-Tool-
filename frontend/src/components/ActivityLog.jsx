import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Clock, User, FileText, CheckCircle, MessageSquare, UserPlus, Trash2 } from 'lucide-react';

const ActivityLog = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, [projectId]);

  const fetchActivityLogs = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/activity`);
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created project':
      case 'created task':
        return <FileText className="w-4 h-4" />;
      case 'updated project':
      case 'updated task':
        return <CheckCircle className="w-4 h-4" />;
      case 'commented on task':
        return <MessageSquare className="w-4 h-4" />;
      case 'added member':
        return <UserPlus className="w-4 h-4" />;
      case 'deleted task':
        return <Trash2 className="w-4 h-4" />;
      case 'moved task':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created project':
      case 'created task':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'updated project':
      case 'updated task':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'commented on task':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'added member':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'deleted task':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'moved task':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatActionText = (log) => {
    const userName = log.userId?.name || 'Unknown user';
    const action = log.action;

    switch (action) {
      case 'created project':
        return `${userName} created the project`;
      case 'created task':
        return `${userName} created task "${log.details?.taskTitle}"`;
      case 'updated project':
        return `${userName} updated the project`;
      case 'updated task':
        return `${userName} updated task "${log.details?.taskTitle}"`;
      case 'commented on task':
        return `${userName} commented on "${log.details?.taskTitle}"`;
      case 'added member':
        return `${userName} added ${log.details?.memberName} to the project`;
      case 'deleted task':
        return `${userName} deleted task "${log.details?.taskTitle}"`;
      case 'moved task':
        return `${userName} moved "${log.details?.taskTitle}" from ${log.details?.from} to ${log.details?.to}`;
      default:
        return `${userName} ${action}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Activity Log
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div key={log._id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(
                log.action
              )}`}
            >
              {getActionIcon(log.action)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {formatActionText(log)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <User className="w-3 h-3" />
                <span>{log.userId?.name}</span>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
