'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Lightbulb,
  Trophy,
  Star,
  Flame,
  Users,
  Globe,
  Smartphone
} from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { Task } from '@/lib/types';

// Disable static generation for this authenticated page
export const dynamic = 'force-dynamic';

/**
 * VVIP Analytics Dashboard - Premium Design
 *
 * Features:
 * - Advanced time period analysis
 * - AI-powered productivity insights
 * - Interactive charts and visualizations
 * - Goal tracking and achievements
 * - Comprehensive performance metrics
 * - Export capabilities
 * - Trend analysis and predictions
 * - Comparative analytics
 */

type TimePeriod = '7days' | '30days' | '90days' | 'all';
type ChartType = 'completion' | 'productivity' | 'trends' | 'goals';

interface ProductivityGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  color: string;
  icon: any;
}

interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  action?: string;
  icon: string;
}

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');
  const [activeChart, setActiveChart] = useState<ChartType>('completion');
  const [isExporting, setIsExporting] = useState(false);

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
          setError('Failed to load analytics data. Please try again.');
        }
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks by time period
  const filteredTasks = useMemo(() => {
    if (timePeriod === 'all') return tasks;

    const now = new Date();
    const daysMap = { '7days': 7, '30days': 30, '90days': 90 };
    const days = daysMap[timePeriod];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return tasks.filter(task => new Date(task.created_at) >= cutoffDate);
  }, [tasks, timePeriod]);

  // Advanced statistics calculation
  const stats = useMemo(() => {
    // Calculate consistency score - moved here to fix initialization order
    const calculateConsistency = () => {
      const last7Days = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        date.setHours(0, 0, 0, 0);

        const dayTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.created_at);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === date.getTime();
        });

        last7Days.push(dayTasks.length > 0 ? 1 : 0);
      }

      return last7Days.reduce((sum, day) => sum + day, 0);
    };

    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.is_complete).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate average tasks per day
    const daysMap = { '7days': 7, '30days': 30, '90days': 90, 'all': 365 };
    const days = daysMap[timePeriod];
    const avgPerDay = total > 0 ? (total / days).toFixed(1) : '0.0';

    // Enhanced productivity score calculation
    const volumeScore = Math.min(40, (total / 20) * 40); // Max 40 points for volume
    const consistencyScore = Math.min(30, (calculateConsistency() / 7) * 30); // Max 30 points for consistency
    const completionScore = completionRate * 0.3; // Max 30 points for completion rate
    const productivityScore = Math.round(volumeScore + consistencyScore + completionScore);

    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasCompletedTask = filteredTasks.some(task => {
        if (!task.is_complete) return false;
        const taskDate = new Date(task.updated_at);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === checkDate.getTime();
      });

      if (hasCompletedTask) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Calculate velocity (tasks completed per week)
    const velocity = Math.round((completed / days) * 7);

    // Calculate efficiency trend - moved here to fix initialization order
    const calculateEfficiencyTrend = () => {
      const periods = [];
      const periodLength = Math.floor(filteredTasks.length / 4) || 1;

      for (let i = 0; i < 4; i++) {
        const start = i * periodLength;
        const end = start + periodLength;
        const periodTasks = filteredTasks.slice(start, end);
        const periodCompletion = periodTasks.length > 0
          ? (periodTasks.filter(t => t.is_complete).length / periodTasks.length) * 100
          : 0;
        periods.push(periodCompletion);
      }

      if (periods.length < 2) return 0;
      return periods[periods.length - 1] - periods[0];
    };

    // Calculate efficiency (completion rate trend)
    const efficiency = calculateEfficiencyTrend();

    return {
      total,
      completed,
      active,
      completionRate,
      avgPerDay,
      productivityScore,
      streak,
      velocity,
      efficiency
    };
  }, [filteredTasks, timePeriod]);

  // Productivity goals
  const productivityGoals: ProductivityGoal[] = useMemo(() => [
    {
      id: 'completion',
      title: 'Completion Rate',
      target: 80,
      current: stats.completionRate,
      unit: '%',
      color: 'from-emerald-500 to-teal-600',
      icon: CheckCircle
    },
    {
      id: 'streak',
      title: 'Daily Streak',
      target: 7,
      current: stats.streak,
      unit: 'days',
      color: 'from-orange-500 to-red-600',
      icon: Flame
    },
    {
      id: 'velocity',
      title: 'Weekly Velocity',
      target: 15,
      current: stats.velocity,
      unit: 'tasks',
      color: 'from-purple-500 to-pink-600',
      icon: Zap
    },
    {
      id: 'productivity',
      title: 'Productivity Score',
      target: 85,
      current: stats.productivityScore,
      unit: 'pts',
      color: 'from-blue-500 to-indigo-600',
      icon: Trophy
    }
  ], [stats]);

  // AI-powered insights
  const aiInsights: AIInsight[] = useMemo(() => {
    const insights: AIInsight[] = [];

    if (stats.streak >= 7) {
      insights.push({
        id: 'streak',
        type: 'success',
        title: 'Incredible Streak!',
        description: `You've maintained a ${stats.streak}-day streak. This consistency is building powerful habits.`,
        action: 'Keep it up!',
        icon: '🔥'
      });
    }

    if (stats.completionRate >= 80) {
      insights.push({
        id: 'completion',
        type: 'success',
        title: 'High Performance',
        description: `${stats.completionRate}% completion rate shows excellent task management skills.`,
        icon: '🎯'
      });
    } else if (stats.completionRate < 50) {
      insights.push({
        id: 'improvement',
        type: 'warning',
        title: 'Room for Growth',
        description: 'Consider breaking large tasks into smaller, manageable chunks.',
        action: 'Try the Pomodoro technique',
        icon: '💡'
      });
    }

    if (stats.efficiency > 10) {
      insights.push({
        id: 'trending',
        type: 'info',
        title: 'Improving Trend',
        description: 'Your efficiency has increased significantly over time.',
        icon: '📈'
      });
    }

    // Always include a tip
    insights.push({
      id: 'tip',
      type: 'tip',
      title: 'Pro Tip',
      description: 'Schedule your most important tasks during your peak energy hours.',
      icon: '🧠'
    });

    return insights.slice(0, 4); // Limit to 4 insights
  }, [stats]);

  // Calculate weekly activity (last 7 days)
  const weeklyActivity = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const activity = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      date.setHours(0, 0, 0, 0);

      const dayTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.created_at);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      });

      const completedTasks = dayTasks.filter(t => t.is_complete).length;

      activity.push({
        day: days[date.getDay()],
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: dayTasks.length,
        completed: completedTasks,
        efficiency: dayTasks.length > 0 ? Math.round((completedTasks / dayTasks.length) * 100) : 0
      });
    }

    return activity;
  }, [filteredTasks]);

  // Get best day of the week
  const bestDay = useMemo(() => {
    const dayCount: { [key: string]: number } = {};

    filteredTasks.forEach(task => {
      if (task.is_complete) {
        const date = new Date(task.updated_at);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        dayCount[dayName] = (dayCount[dayName] || 0) + 1;
      }
    });

    const entries = Object.entries(dayCount);
    if (entries.length === 0) return 'N/A';

    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }, [filteredTasks]);

  // Export analytics data
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export

      const exportData = {
        period: timePeriod,
        stats,
        weeklyActivity,
        goals: productivityGoals,
        insights: aiInsights,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timePeriod}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const maxActivity = Math.max(...weeklyActivity.map(d => d.total), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
          </div>
          <p className="text-slate-600 text-lg mb-6">
            AI-powered productivity analytics and performance insights
          </p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Time Period Selector */}
            <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200">
              {[
                { value: '7days', label: '7 Days' },
                { value: '30days', label: '30 Days' },
                { value: '90days', label: '90 Days' },
                { value: 'all', label: 'All Time' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setTimePeriod(period.value as TimePeriod)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    timePeriod === period.value
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-gray-200"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export Data
            </button>
          </div>
        </div>

        {/* Productivity Score - Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">AI Productivity Score</h2>
                    <p className="text-white/80 text-lg">Powered by advanced analytics</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">Completion Rate</p>
                    <p className="text-2xl font-bold">{stats.completionRate}%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">Current Streak</p>
                    <p className="text-2xl font-bold">{stats.streak} days</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">Weekly Velocity</p>
                    <p className="text-2xl font-bold">{stats.velocity} tasks</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">Efficiency Trend</p>
                    <div className="flex items-center gap-1">
                      {stats.efficiency > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-300" />
                      ) : stats.efficiency < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-300" />
                      ) : (
                        <Minus className="w-4 h-4 text-white/60" />
                      )}
                      <span className="text-xl font-bold">{Math.abs(stats.efficiency).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-white/90 text-lg">
                  Your productivity is {stats.productivityScore >= 80 ? 'exceptional' : stats.productivityScore >= 60 ? 'excellent' : stats.productivityScore >= 40 ? 'good' : 'improving'}!
                  {stats.productivityScore >= 80 && ' You\'re in the top 10% of users.'}
                </p>
              </div>

              {/* Enhanced Circular Progress */}
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  <svg className="w-64 h-64 transform -rotate-90">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="url(#progressGradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 110}`}
                      strokeDashoffset={`${2 * Math.PI * 110 * (1 - stats.productivityScore / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-2000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl font-bold mb-2">{stats.productivityScore}</p>
                      <p className="text-white/80 text-lg">Score</p>
                      <div className="flex justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(stats.productivityScore / 20) ? 'text-yellow-300 fill-current' : 'text-white/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {productivityGoals.map((goal) => {
            const Icon = goal.icon;
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isAchieved = goal.current >= goal.target;

            return (
              <div key={goal.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${goal.color} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {isAchieved && <Trophy className="w-5 h-5 text-yellow-500" />}
                </div>

                <h3 className="text-sm font-semibold text-slate-600 mb-2">{goal.title}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-slate-900">{goal.current}</span>
                  <span className="text-sm text-slate-500">/ {goal.target} {goal.unit}</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 bg-gradient-to-r ${goal.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500">
                  {isAchieved ? 'Goal achieved! 🎉' : `${(goal.target - goal.current)} ${goal.unit} to go`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Weekly Activity */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Weekly Performance</h2>
                </div>
                <div className="text-sm text-slate-500">Last 7 days</div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-700 w-12">
                          {day.day}
                        </span>
                        <span className="text-xs text-slate-500">
                          {day.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-900">
                          {day.total} tasks
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          day.efficiency >= 80 ? 'bg-green-100 text-green-800' :
                          day.efficiency >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {day.efficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-10 bg-slate-100 rounded-xl overflow-hidden group-hover:shadow-md transition-all duration-300">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl transition-all duration-700 ease-out"
                        style={{ width: `${(day.total / maxActivity) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-slate-700">
                          {day.completed} completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Task Distribution */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Task Distribution</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                {/* Enhanced Donut Chart */}
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <defs>
                      <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    {/* Completed segment */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#completedGradient)"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * (1 - stats.completionRate / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Active segment */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#activeGradient)"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset="0"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                      <p className="text-sm text-slate-600">Total Tasks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" />
                    <span className="text-sm font-semibold text-slate-700">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {stats.completed} ({stats.completionRate}%)
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" />
                    <span className="text-sm font-semibold text-slate-700">Active</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">
                    {stats.active} ({100 - stats.completionRate}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI-Powered Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-6 rounded-2xl shadow-xl border transition-all duration-300 hover:scale-105 ${
                  insight.type === 'success' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300' :
                  insight.type === 'warning' ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300' :
                  insight.type === 'info' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-300' :
                  'bg-gradient-to-br from-purple-500 to-pink-600 text-white border-purple-300'
                }`}
              >
                <div className="text-4xl mb-3">{insight.icon}</div>
                <h3 className="text-xl font-bold mb-2">{insight.title}</h3>
                <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                {insight.action && (
                  <button className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors duration-200">
                    {insight.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Performance Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.total}</div>
              <div className="text-slate-600">Total Tasks</div>
              <div className="text-sm text-slate-500 mt-1">
                {stats.avgPerDay} per day average
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.completionRate}%</div>
              <div className="text-slate-600">Success Rate</div>
              <div className="text-sm text-slate-500 mt-1">
                {stats.completed} tasks completed
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{bestDay}</div>
              <div className="text-slate-600">Best Day</div>
              <div className="text-sm text-slate-500 mt-1">
                Most productive weekday
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}