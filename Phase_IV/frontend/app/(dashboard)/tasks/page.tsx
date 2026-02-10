'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TaskTable from '@/components/lark/TaskTable';
import BoardView from '@/components/lark/BoardView';
import TimelineView from '@/components/lark/TimelineView';
import TaskDetailPanel from '@/components/lark/TaskDetailPanel';
import CreateTaskModal from '@/components/lark/CreateTaskModal';
import FilterPanel from '@/components/lark/FilterPanel';
import ExportDropdown from '@/components/lark/ExportDropdown';
import { getToken } from '@/lib/auth';
import {
  Plus,
  Filter,
  Download,
  LayoutList,
  LayoutGrid,
  GanttChart,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  CheckSquare,
  Clock,
  AlertTriangle,
  Star,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Tag,
  Archive,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  Settings,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isBefore } from 'date-fns';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import NotificationService from '@/lib/notification-service';
import { Task } from '@/lib/types';

/**
 * VVIP Tasks Page - Premium Design with Advanced Features
 *
 * Features:
 * - Premium visual design with animations and gradients
 * - Multiple views (List, Board, Timeline) with enhanced UI
 * - Advanced filtering and search capabilities
 * - Bulk actions with confirmation dialogs
 * - Keyboard shortcuts for power users
 * - Real-time task statistics
 * - Responsive design for all devices
 * - Premium loading states and error handling
 * - Floating action button for quick task creation
 * - Enhanced task management with drag & drop
 */
export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'board' | 'timeline'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month' | 'overdue' | 'custom',
    customDateStart: undefined as string | undefined,
    customDateEnd: undefined as string | undefined,
    projects: [] as number[],
    tags: [] as number[],
    completionStatus: 'all' as 'all' | 'complete' | 'incomplete',
  });

  // Check if we should open create modal from URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsCreateModalOpen(true);
    }
  }, [searchParams]);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.is_complete).length;
    const active = total - completed;
    const overdue = tasks.filter(t => {
      if (t.is_complete || !t.due_date) return false;
      return new Date(t.due_date) < new Date();
    }).length;
    const highPriority = tasks.filter(t => !t.is_complete && (t.priority === 'high' || t.priority === 'urgent')).length;
    const dueToday = tasks.filter(t => {
      if (t.is_complete || !t.due_date) return false;
      const today = new Date();
      const dueDate = new Date(t.due_date);
      return dueDate.toDateString() === today.toDateString();
    }).length;

    return { total, completed, active, overdue, highPriority, dueToday };
  }, [tasks]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        router.push('/signin');
        return;
      }

      // Use centralized API client instead of direct fetch
      const { default: apiClient } = await import('@/lib/api-client');
      const data = await apiClient.tasks.list();
      setTasks(data);

      // Generate notifications from tasks
      NotificationService.generateNotificationsFromTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      // N: Create new task
      {
        key: 'n',
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen && !isFilterPanelOpen) {
            setIsCreateModalOpen(true);
          }
        },
        description: 'Create new task',
      },
      // F: Open filters
      {
        key: 'f',
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen) {
            setIsFilterPanelOpen(!isFilterPanelOpen);
          }
        },
        description: 'Toggle filters',
      },
      // Escape: Close modals/panels
      {
        key: 'Escape',
        callback: () => {
          if (isCreateModalOpen) {
            setIsCreateModalOpen(false);
          } else if (isDetailPanelOpen) {
            setIsDetailPanelOpen(false);
            setSelectedTask(null);
          } else if (isFilterPanelOpen) {
            setIsFilterPanelOpen(false);
          }
        },
        description: 'Close modal/panel',
      },
      // 1: Switch to List view
      {
        key: '1',
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen && !isFilterPanelOpen) {
            setCurrentView('list');
          }
        },
        description: 'Switch to List view',
      },
      // 2: Switch to Board view
      {
        key: '2',
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen && !isFilterPanelOpen) {
            setCurrentView('board');
          }
        },
        description: 'Switch to Board view',
      },
      // 3: Switch to Timeline view
      {
        key: '3',
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen && !isFilterPanelOpen) {
            setCurrentView('timeline');
          }
        },
        description: 'Switch to Timeline view',
      },
      // Ctrl+K or Cmd+K: Quick actions (open create modal)
      {
        key: 'k',
        ctrlKey: true,
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen && !isFilterPanelOpen) {
            setIsCreateModalOpen(true);
          }
        },
        description: 'Quick actions',
      },
      {
        key: 'k',
        metaKey: true,
        callback: () => {
          if (!isCreateModalOpen && !isDetailPanelOpen && !isFilterPanelOpen) {
            setIsCreateModalOpen(true);
          }
        },
        description: 'Quick actions',
      },
    ],
  });

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.name.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // Filter by completion status
    if (filters.completionStatus === 'complete') {
      filtered = filtered.filter(task => task.is_complete);
    } else if (filters.completionStatus === 'incomplete') {
      filtered = filtered.filter(task => !task.is_complete);
    }

    // Filter by date range
    if (filters.dateRange !== 'all' && filtered.length > 0) {
      const now = new Date();

      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);

        switch (filters.dateRange) {
          case 'today':
            return isWithinInterval(dueDate, {
              start: startOfDay(now),
              end: endOfDay(now),
            });
          case 'week':
            return isWithinInterval(dueDate, {
              start: startOfWeek(now),
              end: endOfWeek(now),
            });
          case 'month':
            return isWithinInterval(dueDate, {
              start: startOfMonth(now),
              end: endOfMonth(now),
            });
          case 'overdue':
            return isBefore(dueDate, startOfDay(now)) && !task.is_complete;
          case 'custom':
            if (filters.customDateStart && filters.customDateEnd) {
              return isWithinInterval(dueDate, {
                start: startOfDay(new Date(filters.customDateStart)),
                end: endOfDay(new Date(filters.customDateEnd)),
              });
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Filter by projects
    if (filters.projects.length > 0) {
      filtered = filtered.filter(task =>
        task.project_id && filters.projects.includes(task.project_id)
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags?.some(tag => filters.tags.includes(tag.id))
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'due_date':
          aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
          bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, filters, searchQuery, sortBy, sortOrder]);

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailPanelOpen(true);
  };

  // Handle task update
  const handleTaskUpdate = async (taskId: number, updates: Partial<Task>) => {
    try {
      const token = getToken();
      if (!token) return;

      // Get the old task for comparison
      const oldTask = tasks.find(t => t.id === taskId);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();

      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

      // Update selected task if it's the one being updated
      if (selectedTask?.id === taskId) {
        setSelectedTask(updatedTask);
      }

      // Generate notifications for task updates
      if (oldTask) {
        // Notify if task was completed
        if (!oldTask.is_complete && updatedTask.is_complete) {
          NotificationService.notifyTaskCompleted(updatedTask);
        }

        // Notify if status changed
        if (oldTask.status !== updatedTask.status) {
          NotificationService.notifyStatusChanged(
            updatedTask,
            oldTask.status,
            updatedTask.status
          );
        }
      }
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  // Handle task delete
  const handleTaskDelete = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Update local state
      setTasks(tasks.filter(t => t.id !== taskId));

      // Close detail panel if the deleted task was selected
      if (selectedTask?.id === taskId) {
        setIsDetailPanelOpen(false);
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string, taskIds: number[]) => {
    if (action === 'complete') {
      // Mark all selected tasks as complete
      for (const taskId of taskIds) {
        await handleTaskUpdate(taskId, { is_complete: true, status: 'done' });
      }
    } else if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${taskIds.length} task(s)?`)) {
        return;
      }

      for (const taskId of taskIds) {
        await handleTaskDelete(taskId);
      }
    }
    setSelectedTasks([]);
  };

  // Handle task creation
  const handleTaskCreate = async (taskData: any) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();

      // Add to local state
      setTasks([newTask, ...tasks]);
      setIsCreateModalOpen(false);

      // Notify task creation
      NotificationService.notifyTaskCreated(newTask);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  // Premium loading state
  if (loading) {
    return (
      <div className="animate-fade-in">
        {/* Loading Header */}
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-8 bg-slate-300 rounded w-12"></div>
            </div>
          ))}
        </div>

        {/* Loading Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin border-t-emerald-500"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-emerald-300"></div>
              </div>
              <p className="text-slate-600 font-medium">Loading your premium tasks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Premium error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={fetchTasks}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeFiltersCount = filters.status.length + filters.priority.length + filters.projects.length + filters.tags.length +
    (filters.dateRange !== 'all' ? 1 : 0) + (filters.completionStatus !== 'all' ? 1 : 0);

  return (
    <div className="animate-fade-in space-y-6 lg:space-y-8">
      {/* Premium Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-purple-500/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3 text-slate-900">
                <Target className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600" />
                All Tasks
              </h1>
              <p className="text-slate-600 text-sm md:text-base lg:text-lg">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                {filteredTasks.length !== tasks.length && ` of ${tasks.length} total`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600">{Math.round((taskStats.completed / Math.max(taskStats.total, 1)) * 100)}%</div>
                <div className="text-xs lg:text-sm text-slate-500">Completion Rate</div>
              </div>
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckSquare className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
        {/* Total Tasks */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 rounded-lg p-2 shadow-sm transition-all duration-300">
              <BarChart3 className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-1">{taskStats.total}</p>
          <p className="text-xs text-slate-600">Total</p>
        </div>

        {/* Active Tasks */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 rounded-lg p-2 shadow-lg shadow-blue-500/30 transition-all duration-300">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-1">{taskStats.active}</p>
          <p className="text-xs text-slate-600">Active</p>
        </div>

        {/* Completed Tasks */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-700 rounded-lg p-2 shadow-lg shadow-emerald-500/30 transition-all duration-300">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mb-1">{taskStats.completed}</p>
          <p className="text-xs text-slate-600">Completed</p>
        </div>

        {/* Due Today */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-700 rounded-lg p-2 shadow-lg shadow-amber-500/30 transition-all duration-300">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mb-1">{taskStats.dueToday}</p>
          <p className="text-xs text-slate-600">Due Today</p>
        </div>

        {/* High Priority */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700 rounded-lg p-2 shadow-lg shadow-red-500/30 transition-all duration-300">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-1">{taskStats.highPriority}</p>
          <p className="text-xs text-slate-600">High Priority</p>
        </div>

        {/* Overdue */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 rounded-lg p-2 shadow-lg shadow-purple-500/30 transition-all duration-300">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-1">{taskStats.overdue}</p>
          <p className="text-xs text-slate-600">Overdue</p>
        </div>
      </div>

      {/* Enhanced Controls Bar */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side - Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, projects, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-500"
              >
                <option value="created_at" className='text-slate-500'>Created Date</option>
                <option value="due_date" className='text-slate-500'>Due Date</option>
                <option value="priority" className='text-slate-500'>Priority</option>
                <option value="title" className='text-slate-500'>Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Side - View Toggle and Actions */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'list'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setCurrentView('board')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'board'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Board</span>
              </button>
              <button
                onClick={() => setCurrentView('timeline')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'timeline'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GanttChart className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Timeline</span>
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 ${
                activeFiltersCount > 0
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm '
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline font-medium text-slate-500">Filter</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full min-w-[20px] text-center ">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Export Dropdown */}
            <ExportDropdown tasks={filteredTasks} disabled={loading} />

            {/* Create Task Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedTasks.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedTasks([])}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('complete', selectedTasks)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                >
                  <CheckSquare className="w-4 h-4" />
                  Complete
                </button>
                <button
                  onClick={() => handleBulkAction('delete', selectedTasks)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Views */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {currentView === 'list' ? (
          <TaskTable
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onBulkAction={handleBulkAction}
            selectedTasks={selectedTasks}
            onTaskSelect={setSelectedTasks}
          />
        ) : currentView === 'board' ? (
          <BoardView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskUpdate}
          />
        ) : (
          <TimelineView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleTaskCreate}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={setFilters}
        activeFilters={filters}
      />
    </div>
  );
}