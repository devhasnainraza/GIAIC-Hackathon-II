'use client';

import { useState } from 'react';
import { Message } from '@/lib/api/chat';
import { Copy, Check, CheckSquare, Circle, Zap, Calendar, TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

interface StatsData {
  total_tasks: number;
  completed_tasks: number;
  active_tasks: number;
  completion_rate: number;
  completed_today: number;
  completed_this_week: number;
  overdue_tasks: number;
  high_priority_tasks: number;
  productivity_score: number;
}

interface TaskCardData {
  task_id: number;
  title: string;
  priority: 'high' | 'medium' | 'low' | 'none';
  due_date?: string;
}

interface TaskListItem {
  task_id: number;
  title: string;
  priority: 'high' | 'medium' | 'low' | 'none';
  completed: boolean;
}

/**
 * Modern MessageBubble Component - Matches Landing Page Design
 *
 * Features:
 * - Emerald gradient for user messages
 * - White with border for AI messages
 * - Visual stats cards with icons and gradients
 * - Task cards with priority badges
 * - Task list rendering with beautiful gradient cards
 * - Copy-to-clipboard functionality
 * - Smooth slide-in animation
 * - Timestamp below message
 */
export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

// Parse stats from message content
const parseStats = (content: string): StatsData | null => {
  try {
    const statsMatch = content.match(
      /\[STATS_DATA\]([\s\S]*?)\[\/STATS_DATA\]/
    );

    if (statsMatch && statsMatch[1]) {
      return JSON.parse(statsMatch[1]);
    }
  } catch (e) {
    console.error('Failed to parse stats:', e);
  }
  return null;
};

// Parse task card from message content
const parseTaskCard = (content: string): TaskCardData | null => {
  try {
    const taskMatch = content.match(
      /\[TASK_CARD\]([\s\S]*?)\[\/TASK_CARD\]/
    );

    if (taskMatch && taskMatch[1]) {
      return JSON.parse(taskMatch[1]);
    }
  } catch (e) {
    console.error('Failed to parse task card:', e);
  }
  return null;
};

// Parse task list from message content
const parseTaskList = (content: string): TaskListItem[] | null => {
  try {
    const taskListMatch = content.match(
      /\[TASK_LIST\]([\s\S]*?)\[\/TASK_LIST\]/
    );

    if (taskListMatch && taskListMatch[1]) {
      return JSON.parse(taskListMatch[1]);
    }
  } catch (e) {
    console.error('Failed to parse task list:', e);
  }
  return null;
};

// Remove markers from display content
const getDisplayContent = (content: string): string => {
  return content
    .replace(/\[STATS_DATA\][\s\S]*?\[\/STATS_DATA\]/, '')
    .replace(/\[TASK_CARD\][\s\S]*?\[\/TASK_CARD\]/, '')
    .replace(/\[TASK_LIST\]([\s\S]*?)\[\/TASK_LIST\]/, '')
    .trim();
};

  const stats = parseStats(message.content);
  const taskCard = parseTaskCard(message.content);
  const taskList = parseTaskList(message.content);
  const displayContent = getDisplayContent(message.content);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-red-600';
      case 'medium':
        return 'from-amber-500 to-amber-600';
      case 'low':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in-right`}
    >
      <div className="max-w-md group">
        {/* Message Bubble */}
        <div
          className={`relative px-5 py-3 rounded-2xl shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-tr-sm'
              : 'bg-white border-2 border-slate-200 text-slate-700 rounded-tl-sm'
          }`}
        >
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg ${
              isUser
                ? 'hover:bg-emerald-600/50 text-emerald-100'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Message content */}
          <p className="text-sm md:text-base leading-relaxed pr-8">
            {displayContent}
          </p>

          {/* Task Card */}
          {taskCard && (
            <div className="mt-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-2">{taskCard.title}</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(taskCard.priority)}`}>
                      {taskCard.priority.toUpperCase()} PRIORITY
                    </span>
                    {taskCard.due_date && (
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(taskCard.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          {taskList && taskList.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {taskList.map((task) => (
                  <div
                    key={task.task_id}
                    className={`bg-gradient-to-br ${
                      task.completed
                        ? 'from-slate-50 to-slate-100 border-slate-200'
                        : 'from-white to-slate-50 border-slate-300'
                    } border-2 rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getPriorityGradient(task.priority)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm mb-2 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          {task.completed && (
                            <span className="text-xs text-emerald-600 font-medium">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="mt-3 space-y-3">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{stats.completed_tasks}</div>
                  <div className="text-xs text-slate-600 font-medium">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.active_tasks}</div>
                  <div className="text-xs text-slate-600 font-medium">In Progress</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-bold text-purple-600">{stats.completion_rate}%</div>
                  <div className="text-xs text-slate-600 font-medium">Completion</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-bold text-amber-600">{stats.productivity_score}</div>
                  <div className="text-xs text-slate-600 font-medium">Score</div>
                </div>
              </div>

              {/* Week Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Today: <span className="font-bold text-slate-900">{stats.completed_today}</span></span>
                  <span className="text-slate-600">This Week: <span className="font-bold text-slate-900">{stats.completed_this_week}</span></span>
                  {stats.overdue_tasks > 0 && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="font-bold">{stats.overdue_tasks} Overdue</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-slate-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
