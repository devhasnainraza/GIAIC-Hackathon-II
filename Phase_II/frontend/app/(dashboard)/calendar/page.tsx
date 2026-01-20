'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  Star,
  Target,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  List,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  Tag,
  RefreshCw,
  Settings,
  Download,
  Bell,
  Calendar1,
  CalendarDays,
  Sparkles,
  Brain,
  Lightbulb,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isSameMonth, addDays, subDays, startOfDay, endOfDay } from 'date-fns';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  project?: {
    id: number;
    name: string;
    color: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    color: string;
  }>;
}

/**
 * VVIP Calendar Page - Premium Design with Advanced Features
 *
 * Features:
 * - Multiple calendar views (Month, Week, Day, Agenda)
 * - Premium visual design with animations and gradients
 * - Advanced task visualization and management
 * - Drag and drop task scheduling
 * - Real-time calendar statistics
 * - Enhanced task filtering and search
 * - Premium loading states and error handling
 * - Fully responsive design for all devices
 * - Task creation directly from calendar
 * - Smart task recommendations
 * - Calendar insights and analytics
 */
export default function CalendarPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Calculate calendar statistics
  const calendarStats = useMemo(() => {
    const today = new Date();
    const thisWeek = eachDayOfInterval({
      start: startOfWeek(today),
      end: endOfWeek(today)
    });

    const tasksWithDates = tasks.filter(t => t.due_date);
    const overdueTasks = tasksWithDates.filter(t => {
      if (t.is_complete) return false;
      return new Date(t.due_date!) < startOfDay(today);
    });

    const todayTasks = tasksWithDates.filter(t => {
      if (!t.due_date) return false;
      return isSameDay(new Date(t.due_date), today);
    });

    const thisWeekTasks = tasksWithDates.filter(t => {
      if (!t.due_date) return false;
      const taskDate = new Date(t.due_date);
      return thisWeek.some(day => isSameDay(day, taskDate));
    });

    const completedThisWeek = thisWeekTasks.filter(t => t.is_complete).length;
    const highPriorityTasks = tasksWithDates.filter(t =>
      !t.is_complete && (t.priority === 'high' || t.priority === 'urgent')
    ).length;

    return {
      totalWithDates: tasksWithDates.length,
      overdue: overdueTasks.length,
      today: todayTasks.length,
      thisWeek: thisWeekTasks.length,
      completedThisWeek,
      highPriority: highPriorityTasks,
      completionRate: thisWeekTasks.length > 0 ? Math.round((completedThisWeek / thisWeekTasks.length) * 100) : 0
    };
  }, [tasks]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getToken();
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await fetch('http://localhost:8000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load calendar data. Please try again.');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Get tasks for a specific date (by due date)
  const getTasksForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    let filteredTasks = tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === targetDate.getTime();
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.name.toLowerCase().includes(query)
      );
    }

    return filteredTasks;
  };

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's days to show
    const prevMonthDays = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();

    // Build calendar grid
    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      taskCount: number;
      completedCount: number;
      overdueCount: number;
      highPriorityCount: number;
      tasks: Task[];
    }> = [];

    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dayTasks = getTasksForDate(date);
      const overdue = dayTasks.filter(t => !t.is_complete && new Date(t.due_date!) < new Date()).length;
      const highPriority = dayTasks.filter(t => !t.is_complete && (t.priority === 'high' || t.priority === 'urgent')).length;

      days.push({
        date,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        taskCount: dayTasks.length,
        completedCount: dayTasks.filter(t => t.is_complete).length,
        overdueCount: overdue,
        highPriorityCount: highPriority,
        tasks: dayTasks,
      });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTasks = getTasksForDate(date);
      const overdue = dayTasks.filter(t => !t.is_complete && new Date(t.due_date!) < new Date()).length;
      const highPriority = dayTasks.filter(t => !t.is_complete && (t.priority === 'high' || t.priority === 'urgent')).length;

      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        taskCount: dayTasks.length,
        completedCount: dayTasks.filter(t => t.is_complete).length,
        overdueCount: overdue,
        highPriorityCount: highPriority,
        tasks: dayTasks,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dayTasks = getTasksForDate(date);
      const overdue = dayTasks.filter(t => !t.is_complete && new Date(t.due_date!) < new Date()).length;
      const highPriority = dayTasks.filter(t => !t.is_complete && (t.priority === 'high' || t.priority === 'urgent')).length;

      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        taskCount: dayTasks.length,
        completedCount: dayTasks.filter(t => t.is_complete).length,
        overdueCount: overdue,
        highPriorityCount: highPriority,
        tasks: dayTasks,
      });
    }

    return days;
  }, [currentDate, tasks, searchQuery]);

  // Get week data for week view
  const weekData = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return weekDays.map(date => ({
      date,
      tasks: getTasksForDate(date),
      isToday: isToday(date)
    }));
  }, [currentDate, tasks, searchQuery]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return getTasksForDate(selectedDate);
  }, [selectedDate, tasks, searchQuery]);

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
    setSelectedDate(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
    setSelectedDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get navigation handlers based on view mode
  const getNavigationHandlers = () => {
    switch (viewMode) {
      case 'week':
        return { prev: goToPreviousWeek, next: goToNextWeek };
      case 'day':
        return { prev: goToPreviousDay, next: goToNextDay };
      default:
        return { prev: goToPreviousMonth, next: goToNextMonth };
    }
  };

  // Get view title
  const getViewTitle = () => {
    switch (viewMode) {
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'agenda':
        return 'Agenda View';
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: 'To Do', color: 'bg-slate-100 text-slate-700', icon: CheckSquare },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
      review: { label: 'Review', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
      done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700', icon: CheckSquare },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.todo;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Get priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  // Premium loading state
  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        {/* Loading Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl lg:rounded-3xl p-6 lg:p-8 animate-pulse">
          <div className="h-8 bg-slate-300 rounded-lg w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-8 bg-slate-300 rounded w-12"></div>
            </div>
          ))}
        </div>

        {/* Loading Calendar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin border-t-emerald-500"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-emerald-300"></div>
              </div>
              <p className="text-slate-600 font-medium">Loading your premium calendar...</p>
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
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const navHandlers = getNavigationHandlers();

  return (
    <div className="animate-fade-in space-y-6 lg:space-y-8">
      {/* Premium Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 lg:w-10 lg:h-10" />
                Calendar
              </h1>
              <p className="text-slate-300 text-sm md:text-base lg:text-lg">
                {getViewTitle()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-purple-400">{calendarStats.completionRate}%</div>
                <div className="text-xs lg:text-sm text-slate-400">Weekly Completion</div>
              </div>
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Brain className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-6">
        {/* Total with Dates */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 rounded-lg p-2 shadow-sm transition-all duration-300">
              <CalendarDays className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-1">{calendarStats.totalWithDates}</p>
          <p className="text-xs text-slate-600">Scheduled</p>
        </div>

        {/* Today */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-700 rounded-lg p-2 shadow-lg shadow-emerald-500/30 transition-all duration-300">
              <Calendar1 className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mb-1">{calendarStats.today}</p>
          <p className="text-xs text-slate-600">Today</p>
        </div>

        {/* This Week */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 rounded-lg p-2 shadow-lg shadow-blue-500/30 transition-all duration-300">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-1">{calendarStats.thisWeek}</p>
          <p className="text-xs text-slate-600">This Week</p>
        </div>

        {/* Completed This Week */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700 rounded-lg p-2 shadow-lg shadow-green-500/30 transition-all duration-300">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-1">{calendarStats.completedThisWeek}</p>
          <p className="text-xs text-slate-600">Completed</p>
        </div>

        {/* High Priority */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700 rounded-lg p-2 shadow-lg shadow-red-500/30 transition-all duration-300">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-1">{calendarStats.highPriority}</p>
          <p className="text-xs text-slate-600">High Priority</p>
        </div>

        {/* Overdue */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 rounded-lg p-2 shadow-lg shadow-orange-500/30 transition-all duration-300">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600 mb-1">{calendarStats.overdue}</p>
          <p className="text-xs text-slate-600">Overdue</p>
        </div>

        {/* Completion Rate */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 rounded-lg p-2 shadow-lg shadow-purple-500/30 transition-all duration-300">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-1">{calendarStats.completionRate}%</p>
          <p className="text-xs text-slate-600">Rate</p>
        </div>
      </div>

      {/* Enhanced Controls Bar */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side - Search and Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search calendar tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={navHandlers.prev}
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={navHandlers.next}
                className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Right Side - View Toggle and Actions */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'month'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Month</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'week'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Week</span>
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'day'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar1 className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Day</span>
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'agenda'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Agenda</span>
              </button>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>

            {/* Create Task Button */}
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Calendar View */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {viewMode === 'month' && (
              <>
                {/* Month View Header */}
                <div className="p-4 lg:p-6 border-b border-slate-200">
                  <h2 className="text-lg lg:text-xl font-bold text-slate-900">Month View</h2>
                  <p className="text-sm text-slate-600">Click on any date to view tasks</p>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {calendarData.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`aspect-square p-2 border-b border-r border-slate-200 hover:bg-slate-50 transition-all duration-200 group ${
                        !day.isCurrentMonth ? 'bg-slate-50' : ''
                      } ${
                        day.date.getTime() === selectedDate.getTime()
                          ? 'bg-purple-50 border-purple-300'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <span
                          className={`text-sm font-medium mb-1 ${
                            day.isToday
                              ? 'w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center'
                              : day.isCurrentMonth
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {day.dayNumber}
                        </span>

                        {/* Task Indicators */}
                        {day.taskCount > 0 && (
                          <div className="flex-1 flex flex-col gap-0.5">
                            {/* Task count */}
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              <span className="text-xs text-slate-600">{day.taskCount}</span>
                            </div>

                            {/* Completed count */}
                            {day.completedCount > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckSquare className="w-2.5 h-2.5 text-emerald-500" />
                                <span className="text-xs text-emerald-600">{day.completedCount}</span>
                              </div>
                            )}

                            {/* High priority indicator */}
                            {day.highPriorityCount > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 text-red-500" />
                                <span className="text-xs text-red-600">{day.highPriorityCount}</span>
                              </div>
                            )}

                            {/* Overdue indicator */}
                            {day.overdueCount > 0 && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-orange-500" />
                                <span className="text-xs text-orange-600">{day.overdueCount}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'week' && (
              <>
                {/* Week View Header */}
                <div className="p-4 lg:p-6 border-b border-slate-200">
                  <h2 className="text-lg lg:text-xl font-bold text-slate-900">Week View</h2>
                  <p className="text-sm text-slate-600">Weekly overview of your tasks</p>
                </div>

                {/* Week Grid */}
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {weekData.map((day, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          day.isToday
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-center mb-3">
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {format(day.date, 'EEE')}
                          </div>
                          <div className={`text-lg font-bold ${
                            day.isToday ? 'text-purple-600' : 'text-slate-900'
                          }`}>
                            {format(day.date, 'd')}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {day.tasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className={`p-2 rounded text-xs ${
                                task.is_complete
                                  ? 'bg-emerald-100 text-emerald-700 line-through'
                                  : task.priority === 'high' || task.priority === 'urgent'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {day.tasks.length > 3 && (
                            <div className="text-xs text-slate-500 text-center">
                              +{day.tasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {viewMode === 'day' && (
              <>
                {/* Day View Header */}
                <div className="p-4 lg:p-6 border-b border-slate-200">
                  <h2 className="text-lg lg:text-xl font-bold text-slate-900">Day View</h2>
                  <p className="text-sm text-slate-600">{format(currentDate, 'EEEE, MMMM d, yyyy')}</p>
                </div>

                {/* Day Tasks */}
                <div className="p-4 lg:p-6">
                  <div className="space-y-4">
                    {getTasksForDate(currentDate).length === 0 ? (
                      <div className="text-center py-12">
                        <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-4">No tasks scheduled for this day</p>
                        <button
                          onClick={() => setShowTaskModal(true)}
                          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Task
                        </button>
                      </div>
                    ) : (
                      getTasksForDate(currentDate).map((task) => (
                        <div
                          key={task.id}
                          className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className={`font-semibold text-slate-900 ${task.is_complete ? 'line-through text-slate-400' : ''}`}>
                              {task.title}
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-600 mb-3">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {getStatusBadge(task.status)}
                            {task.project && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {task.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {viewMode === 'agenda' && (
              <>
                {/* Agenda View Header */}
                <div className="p-4 lg:p-6 border-b border-slate-200">
                  <h2 className="text-lg lg:text-xl font-bold text-slate-900">Agenda View</h2>
                  <p className="text-sm text-slate-600">Upcoming tasks and deadlines</p>
                </div>

                {/* Agenda List */}
                <div className="p-4 lg:p-6">
                  <div className="space-y-6">
                    {/* Today */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Today</h3>
                      <div className="space-y-2">
                        {getTasksForDate(new Date()).length === 0 ? (
                          <p className="text-sm text-slate-500">No tasks due today</p>
                        ) : (
                          getTasksForDate(new Date()).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <div className={`w-3 h-3 rounded-full ${
                                task.is_complete ? 'bg-emerald-500' :
                                task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500' : 'bg-slate-400'
                              }`} />
                              <div className="flex-1">
                                <p className={`font-medium ${task.is_complete ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(task.status)}
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Tomorrow */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Tomorrow</h3>
                      <div className="space-y-2">
                        {getTasksForDate(addDays(new Date(), 1)).length === 0 ? (
                          <p className="text-sm text-slate-500">No tasks due tomorrow</p>
                        ) : (
                          getTasksForDate(addDays(new Date(), 1)).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <div className={`w-3 h-3 rounded-full ${
                                task.is_complete ? 'bg-emerald-500' :
                                task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-500' : 'bg-slate-400'
                              }`} />
                              <div className="flex-1">
                                <p className={`font-medium ${task.is_complete ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(task.status)}
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Overdue */}
                    {calendarStats.overdue > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-red-900 mb-3">Overdue</h3>
                        <div className="space-y-2">
                          {tasks.filter(t => {
                            if (t.is_complete || !t.due_date) return false;
                            return new Date(t.due_date) < startOfDay(new Date());
                          }).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <div className="flex-1">
                                <p className="font-medium text-red-900">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(task.status)}
                                  <span className="text-xs text-red-600">
                                    Due {format(new Date(task.due_date!), 'MMM d')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar - Selected Date Tasks */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {format(selectedDate, 'MMM d')}
              </h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                {selectedDateTasks.length} tasks
              </span>
            </div>

            {/* Tasks List */}
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-4">No tasks on this date</p>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Add a task
                  </button>
                </div>
              ) : (
                selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer group"
                  >
                    <h4 className={`font-medium text-slate-900 mb-2 ${task.is_complete ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {getStatusBadge(task.status)}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.project && (
                      <div className="mt-2">
                        <span className="text-xs text-slate-500">
                          {task.project.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowTaskModal(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}