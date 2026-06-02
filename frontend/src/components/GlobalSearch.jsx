import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, X, FolderKanban, CheckSquare, Users } from 'lucide-react';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], users: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length < 2) {
        setResults({ projects: [], tasks: [], users: [] });
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/search', { params: { query } });
        setResults(response.data.results);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Global Search"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, tasks, and users..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
            autoFocus
          />
          <button
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin text-2xl">⏳</div>
            </div>
          ) : query.length < 2 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Type at least 2 characters to search
            </p>
          ) : results.projects.length === 0 &&
            results.tasks.length === 0 &&
            results.users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No results found for "{query}"
            </p>
          ) : (
            <div className="space-y-6">
              {results.projects.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4" />
                    Projects ({results.projects.length})
                  </h3>
                  <div className="space-y-2">
                    {results.projects.map((project) => (
                      <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                        {project.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {project.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.tasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Tasks ({results.tasks.length})
                  </h3>
                  <div className="space-y-2">
                    {results.tasks.map((task) => (
                      <Link
                        key={task._id}
                        to={`/projects/${task.projectId._id}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          in {task.projectId.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.users.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Users ({results.users.length})
                  </h3>
                  <div className="space-y-2">
                    {results.users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
