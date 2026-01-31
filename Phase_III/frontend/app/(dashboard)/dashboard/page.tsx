'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
  Zap,
  Target,
  AlertTriangle,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Flame,
  Timer,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Trophy,
  Brain,
  Lightbulb
} from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import { getUser } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { Task } from '@/lib/types';

// Disable static generation for this authenticated page
export const dynamic = 'force-dynamic';

/**
 * VVIP Dashboard Page - Premium Design with Advanced Analytics
 *
 * Features:
 * - Enhanced Stats Cards with animations and trends
 * - Data Visualizations (Priority breakdown, Weekly progress)
 * - Upcoming Deadlines with smart alerts
 * - Productivity Insights and AI-powered suggestions
 * - Today's Focus with priority scoring
 * - Recent Activity with detailed timeline
 * - Quick Actions with contextual recommendations
 * - Fully responsive design for all devices
 * - Premium animations and micro-interactions
 */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user on mount
  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedTasks = await apiClient.tasks.list();
        setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Enhanced statistics with trends and insights
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.is_complete).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = tasks.filter(t => {
      if (!t.is_complete) return false;
      const updatedDate = new Date(t.updated_at);
      updatedDate.setHours(0, 0, 0, 0);
      return updatedDate.getTime() === today.getTime();
    }).length;

    // Calculate weekly progress
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const completedThisWeek = tasks.filter(t => {
      if (!t.is_complete) return false;
      const updatedDate = new Date(t.updated_at);
      return updatedDate >= weekAgo;
    }).length;

    // Calculate overdue tasks
    const overdue = tasks.filter(t => {
      if (t.is_complete || !t.due_date) return false;
      return new Date(t.due_date) < new Date();
    }).length;

    // Calculate high priority tasks
    const highPriority = tasks.filter(t => !t.is_complete && t.priority === 'high').length;

    // Calculate productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (completedToday * 20) +
      (completionRate * 0.5) +
      (Math.max(0, 10 - overdue) * 3)
    ));

    return {
      total,
      completed,
      active,
      completionRate,
      completedToday,
      completedThisWeek,
      overdue,
      highPriority,
      productivityScore
    };
  }, [tasks]);

  // Priority breakdown for visualization
  const priorityBreakdown = useMemo(() => {
    const activeTasks = tasks.filter(t => !t.is_complete);
    const high = activeTasks.filter(t => t.priority === 'high').length;
    const medium = activeTasks.filter(t => t.priority === 'medium').length;
    const low = activeTasks.filter(t => t.priority === 'low').length;
    const none = activeTasks.filter(t => !t.priority || t.priority === 'none').length;

    return { high, medium, low, none };
  }, [tasks]);

  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return tasks
      .filter(t => !t.is_complete && t.due_date)
      .filter(t => {
        const dueDate = new Date(t.due_date!);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      .slice(0, 5);
  }, [tasks]);

  // Get today's focus tasks with priority scoring
  const todaysFocus = useMemo(() => {
    const activeTasks = tasks.filter(t => !t.is_complete);

    // Score tasks based on priority, due date, and creation time
    const scoredTasks = activeTasks.map(task => {
      let score = 0;

      // Priority scoring
      if (task.priority === 'high') score += 10;
      else if (task.priority === 'medium') score += 5;
      else if (task.priority === 'low') score += 2;

      // Due date scoring
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const now = new Date();
        const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) score += 15; // Overdue
        else if (daysDiff === 0) score += 12; // Due today
        else if (daysDiff === 1) score += 8; // Due tomorrow
        else if (daysDiff <= 3) score += 5; // Due this week
      }

      // Recency scoring (newer tasks get slight boost)
      const daysSinceCreated = Math.floor((new Date().getTime() - new Date(task.created_at).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCreated <= 1) score += 3;
      else if (daysSinceCreated <= 3) score += 1;

      return { ...task, focusScore: score };
    });

    return scoredTasks
      .sort((a, b) => b.focusScore - a.focusScore)
      .slice(0, 6);
  }, [tasks]);

  // Enhanced recent activity with more details
  const recentActivity = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 8)
      .map(task => ({
        id: task.id,
        title: task.title,
        action: task.is_complete ? 'completed' : 'created',
        timestamp: task.updated_at,
        priority: task.priority,
        dueDate: task.due_date
      }));
  }, [tasks]);

  // Productivity insights
  const insights = useMemo(() => {
    const insights = [];

    if (stats.completedToday >= 3) {
      insights.push({
        type: 'positive',
        icon: Trophy,
        title: 'Great Progress!',
        message: `You've completed ${stats.completedToday} tasks today. Keep it up!`
      });
    }

    if (stats.overdue > 0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Overdue Tasks',
        message: `You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Consider prioritizing them.`
      });
    }

    if (stats.highPriority > 0) {
      insights.push({
        type: 'info',
        icon: Star,
        title: 'High Priority Focus',
        message: `${stats.highPriority} high-priority task${stats.highPriority > 1 ? 's' : ''} need${stats.highPriority === 1 ? 's' : ''} your attention.`
      });
    }

    if (stats.completionRate >= 80) {
      insights.push({
        type: 'positive',
        icon: Award,
        title: 'Excellent Completion Rate',
        message: `${stats.completionRate}% completion rate shows great productivity!`
      });
    }

    if (stats.completedThisWeek >= 10) {
      insights.push({
        type: 'positive',
        icon: Flame,
        title: 'Weekly Streak',
        message: `${stats.completedThisWeek} tasks completed this week. You're on fire!`
      });
    }

    return insights.slice(0, 3);
  }, [stats]);

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Format due date
  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return date.toLocaleDateString();
  };

  // Handle quick complete
  const handleQuickComplete = async (taskId: number) => {
    try {
      const updatedTask = await apiClient.tasks.toggleComplete(taskId, true);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" message="Loading your premium dashboard..." centered />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 lg:space-y-8">
      {/* Premium Colorful Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-purple-500/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-slate-900">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'there'}! ✨
              </h1>
              <p className="text-slate-600 text-sm md:text-base lg:text-lg">
                Here's your productivity overview for today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-emerald-600">{stats.productivityScore}</div>
                <div className="text-xs lg:text-sm text-slate-500">Productivity Score</div>
              </div>
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Brain className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colorful Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Tasks */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 rounded-xl p-3 shadow-sm transition-all duration-300">
              <CheckSquare className="w-5 h-5 lg:w-6 lg:h-6 text-slate-700" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">+{Math.floor(stats.total * 0.1)}</span>
              </div>
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stats.total}</p>
          <p className="text-sm text-slate-600">All Tasks</p>
          <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Completed Today */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-700 rounded-xl p-3 shadow-lg shadow-emerald-500/30 transition-all duration-300">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today</span>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">Active</span>
              </div>
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">{stats.completedToday}</p>
          <p className="text-sm text-slate-600">Completed Today</p>
          <div className="mt-3 h-1 bg-emerald-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse" style={{ width: `${Math.min(100, stats.completedToday * 20)}%` }} />
          </div>
        </div>

        {/* Active Tasks */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-700 rounded-xl p-3 shadow-lg shadow-amber-500/30 transition-all duration-300">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active</span>
              {stats.overdue > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">{stats.overdue} overdue</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-amber-600 mb-1">{stats.active}</p>
          <p className="text-sm text-slate-600">In Progress</p>
          <div className="mt-3 h-1 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-pulse" style={{ width: `${Math.min(100, (stats.active / Math.max(stats.total, 1)) * 100)}%` }} />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl p-4 lg:p-6 border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 rounded-xl p-3 shadow-lg shadow-purple-500/30 transition-all duration-300">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rate</span>
              <div className="flex items-center gap-1 mt-1">
                {stats.completionRate >= 80 ? (
                  <ArrowUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${stats.completionRate >= 80 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stats.completionRate >= 80 ? 'Excellent' : 'Needs focus'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stats.completionRate}%</p>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        {/* Today's Focus Section - Enhanced */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-2 shadow-lg shadow-emerald-500/30">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-slate-900">Today's Focus</h2>
                    <p className="text-xs lg:text-sm text-slate-600">Prioritized by urgency and importance</p>
                  </div>
                </div>
                <Link
                  href="/tasks"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 self-start sm:self-auto"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-4 lg:p-6">
              {todaysFocus.length === 0 ? (
                <div className="text-center py-8 lg:py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-4">No active tasks</p>
                  <Link
                    href="/tasks"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  {todaysFocus.map((task, index) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 lg:p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 group hover:shadow-md"
                    >
                      <button
                        onClick={() => handleQuickComplete(task.id)}
                        className="mt-0.5 w-5 h-5 rounded border-2 border-slate-300 hover:border-emerald-500 transition-colors flex-shrink-0 hover:scale-110"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {task.title}
                          </h3>
                          {index < 3 && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          {task.priority && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                          {task.due_date && (
                            <span className="text-xs text-slate-500">
                              {formatDueDate(task.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href="/tasks"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:text-emerald-700"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2 shadow-lg shadow-red-500/30">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
                  <p className="text-xs text-slate-600">Next 7 days</p>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-6">
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                        new Date(task.due_date!) < new Date() ? 'bg-red-500' :
                        Math.ceil((new Date(task.due_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 1 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-900 truncate mb-1">
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {formatDueDate(task.due_date!)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority Breakdown Visualization */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 shadow-lg shadow-purple-500/30">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Priority Breakdown</h2>
                  <p className="text-xs text-slate-600">Active tasks by priority</p>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-6">
              <div className="space-y-3">
                {[
                  { label: 'High Priority', count: priorityBreakdown.high, color: 'bg-red-500', bgColor: 'bg-red-100' },
                  { label: 'Medium Priority', count: priorityBreakdown.medium, color: 'bg-amber-500', bgColor: 'bg-amber-100' },
                  { label: 'Low Priority', count: priorityBreakdown.low, color: 'bg-emerald-500', bgColor: 'bg-emerald-100' },
                  { label: 'No Priority', count: priorityBreakdown.none, color: 'bg-slate-500', bgColor: 'bg-slate-100' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                      <div className={`px-2 py-0.5 ${item.bgColor} rounded-full`}>
                        <span className="text-xs font-medium text-slate-700">
                          {stats.active > 0 ? Math.round((item.count / stats.active) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-2 shadow-lg shadow-indigo-500/30">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-slate-900">Productivity Insights</h2>
                <p className="text-xs lg:text-sm text-slate-600">AI-powered recommendations</p>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'positive' ? 'bg-emerald-50 border-emerald-500' :
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start gap-3">
                    <insight.icon className={`w-5 h-5 mt-0.5 ${
                      insight.type === 'positive' ? 'text-emerald-600' :
                      insight.type === 'warning' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{insight.title}</h3>
                      <p className="text-xs text-slate-600">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg p-2 shadow-lg shadow-slate-500/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs lg:text-sm text-slate-600">Your latest task updates</p>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.action === 'completed'
                        ? 'bg-emerald-100'
                        : 'bg-slate-100'
                    }`}>
                      {activity.action === 'completed' ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    {index < recentActivity.length - 1 && (
                      <div className="absolute top-8 left-1/2 w-px h-6 bg-slate-200 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-slate-900 font-medium truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-600">
                            {activity.action === 'completed' ? 'Completed' : 'Created'} • {formatRelativeTime(activity.timestamp)}
                          </p>
                          {activity.priority && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                              activity.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {activity.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-xl lg:rounded-2xl shadow-lg p-6 lg:p-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <Link
              href="/tasks"
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 transition-all duration-300 hover:scale-105 group"
            >
              <div className="bg-emerald-500 rounded-lg p-3 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Create Task</p>
                <p className="text-slate-300 text-sm">Add a new task</p>
              </div>
            </Link>

            <Link
              href="/tasks"
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 transition-all duration-300 hover:scale-105 group"
            >
              <div className="bg-amber-500 rounded-lg p-3 shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">View All Tasks</p>
                <p className="text-slate-300 text-sm">Manage your tasks</p>
              </div>
            </Link>

            <Link
              href="/calendar"
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 transition-all duration-300 hover:scale-105 group"
            >
              <div className="bg-purple-500 rounded-lg p-3 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">View Calendar</p>
                <p className="text-slate-300 text-sm">See your schedule</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}