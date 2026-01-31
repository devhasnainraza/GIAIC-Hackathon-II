'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, differenceInDays, isWithinInterval, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flag, Circle, Clock, AlertCircle, Check } from 'lucide-react';
import { Task } from '@/lib/types';

interface TimelineViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

/**
 * Lark Base-inspired Timeline View (Gantt Chart)
 *
 * Features:
 * - Horizontal timeline with date markers
 * - Tasks displayed as bars with duration
 * - Color-coded by status
 * - Grouped by project (optional)
 * - Month navigation
 * - Responsive design
 */
export default function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [groupByProject, setGroupByProject] = useState(false);

  // Calculate timeline range (current month)
  const timelineStart = startOfMonth(currentMonth);
  const timelineEnd = endOfMonth(currentMonth);
  const timelineDays = eachDayOfInterval({ start: timelineStart, end: timelineEnd });

  // Filter tasks that have dates within or overlapping the current month
  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.due_date) return false;

      const taskStart = startOfDay(new Date(task.created_at));
      const taskEnd = startOfDay(new Date(task.due_date));

      // Check if task overlaps with current month
      return isWithinInterval(taskStart, { start: timelineStart, end: timelineEnd }) ||
             isWithinInterval(taskEnd, { start: timelineStart, end: timelineEnd }) ||
             (taskStart <= timelineStart && taskEnd >= timelineEnd);
    });
  }, [tasks, timelineStart, timelineEnd]);

  // Group tasks by project if enabled
  const groupedTasks = useMemo(() => {
    if (!groupByProject) {
      return [{ projectName: 'All Tasks', projectColor: '#10b981', tasks: visibleTasks }];
    }

    const groups: Record<string, { projectName: string; projectColor: string; tasks: Task[] }> = {};

    visibleTasks.forEach(task => {
      const key = task.project ? `project-${task.project.id}` : 'no-project';
      const name = task.project ? task.project.name : 'No Project';
      const color = task.project ? task.project.color : '#94a3b8';

      if (!groups[key]) {
        groups[key] = { projectName: name, projectColor: color, tasks: [] };
      }
      groups[key].tasks.push(task);
    });

    return Object.values(groups);
  }, [visibleTasks, groupByProject]);

  // Get status configuration
  const getStatusConfig = (status: string) => {
    const configs = {
      todo: { color: 'bg-slate-400', icon: Circle, label: 'To Do' },
      in_progress: { color: 'bg-blue-500', icon: Clock, label: 'In Progress' },
      review: { color: 'bg-amber-500', icon: AlertCircle, label: 'Review' },
      done: { color: 'bg-emerald-500', icon: Check, label: 'Done' },
    };
    return configs[status as keyof typeof configs] || configs.todo;
  };

  // Get priority badge
  const getPriorityIcon = (priority: string) => {
    const configs = {
      low: { color: 'text-slate-500' },
      medium: { color: 'text-blue-500' },
      high: { color: 'text-orange-500' },
      urgent: { color: 'text-red-500' },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  // Calculate task bar position and width
  const getTaskBarStyle = (task: Task) => {
    const taskStart = startOfDay(new Date(task.created_at));
    const taskEnd = startOfDay(new Date(task.due_date!));

    // Clamp to visible range
    const visibleStart = taskStart < timelineStart ? timelineStart : taskStart;
    const visibleEnd = taskEnd > timelineEnd ? timelineEnd : taskEnd;

    const startOffset = differenceInDays(visibleStart, timelineStart);
    const duration = differenceInDays(visibleEnd, visibleStart) + 1;

    const dayWidth = 100 / timelineDays.length;
    const left = startOffset * dayWidth;
    const width = duration * dayWidth;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGroupByProject(!groupByProject)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              groupByProject
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Group by Project
          </button>
          <span className="text-sm text-slate-600">
            {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Date Headers */}
        <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
          <div className="flex">
            {/* Task Name Column */}
            <div className="w-64 flex-shrink-0 px-4 py-3 border-r border-slate-200">
              <span className="text-xs font-semibold text-slate-700 uppercase">Task</span>
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 relative">
              <div className="flex">
                {timelineDays.map((day, index) => {
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                  return (
                    <div
                      key={index}
                      className={`flex-1 px-1 py-3 text-center border-r border-slate-200 ${
                        isToday ? 'bg-emerald-50' : isWeekend ? 'bg-slate-100' : ''
                      }`}
                      style={{ minWidth: '40px' }}
                    >
                      <div className="text-xs font-medium text-slate-600">
                        {format(day, 'd')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(day, 'EEE')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Task Rows */}
        <div className="divide-y divide-slate-200">
          {groupedTasks.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <div className="text-center">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-sm">No tasks with due dates in this month</p>
              </div>
            </div>
          ) : (
            groupedTasks.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Project Header (if grouped) */}
                {groupByProject && (
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.projectColor }}
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {group.projectName}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({group.tasks.length})
                      </span>
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {group.tasks.map((task) => {
                  const statusConfig = getStatusConfig(task.status);
                  const priorityConfig = getPriorityIcon(task.priority);
                  const barStyle = getTaskBarStyle(task);

                  return (
                    <div key={task.id} className="flex hover:bg-slate-50 transition-colors">
                      {/* Task Name Column */}
                      <div className="w-64 flex-shrink-0 px-4 py-3 border-r border-slate-200">
                        <div className="flex items-start gap-2">
                          <Flag className={`w-4 h-4 mt-0.5 flex-shrink-0 ${priorityConfig.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium text-slate-900 truncate ${
                              task.is_complete ? 'line-through text-slate-400' : ''
                            }`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                                statusConfig.color
                              } text-white`}>
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Grid */}
                      <div className="flex-1 relative py-3">
                        {/* Background Grid */}
                        <div className="absolute inset-0 flex">
                          {timelineDays.map((day, index) => {
                            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            return (
                              <div
                                key={index}
                                className={`flex-1 border-r border-slate-200 ${
                                  isToday ? 'bg-emerald-50/50' : isWeekend ? 'bg-slate-50' : ''
                                }`}
                                style={{ minWidth: '40px' }}
                              />
                            );
                          })}
                        </div>

                        {/* Task Bar */}
                        <div className="relative h-8 px-1">
                          <button
                            onClick={() => onTaskClick(task)}
                            className={`absolute h-full rounded-lg ${statusConfig.color} hover:opacity-90 transition-all shadow-sm hover:shadow-md cursor-pointer`}
                            style={barStyle}
                            title={`${task.title}\n${format(new Date(task.created_at), 'MMM d')} - ${format(new Date(task.due_date!), 'MMM d')}`}
                          >
                            <div className="px-2 h-full flex items-center">
                              <span className="text-xs font-medium text-white truncate">
                                {task.title}
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium text-slate-700">Status:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-400" />
          <span className="text-slate-600">To Do</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-slate-600">In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-slate-600">Review</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-slate-600">Done</span>
        </div>
      </div>
    </div>
  );
}
