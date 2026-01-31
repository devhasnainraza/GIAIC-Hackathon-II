'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Edit2,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  FolderOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '@/lib/types';

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: number) => void;
  onBulkAction: (action: string, taskIds: number[]) => void;
  selectedTasks: number[];
  onTaskSelect: React.Dispatch<React.SetStateAction<number[]>>;
}

type SortField = 'title' | 'status' | 'priority' | 'due_date' | 'created_at';
type SortDirection = 'asc' | 'desc';

/**
 * Lark Base-inspired Task Table
 *
 * Features:
 * - Inline editing
 * - Sortable columns
 * - Bulk selection and actions
 * - Status badges
 * - Priority indicators
 * - Hover effects
 */
export default function TaskTable({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskDelete,
  onBulkAction
}: TaskTableProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'due_date' || sortField === 'created_at') {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
    }
  };

  // Handle select single
  const handleSelectTask = (taskId: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      todo: { label: 'To Do', color: 'bg-slate-100 text-slate-700', icon: Circle },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
      review: { label: 'Review', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
      done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700', icon: Check },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.todo;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  // Priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Low', color: 'text-slate-500' },
      medium: { label: 'Medium', color: 'text-blue-500' },
      high: { label: 'High', color: 'text-orange-500' },
      urgent: { label: 'Urgent', color: 'text-red-500' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedTasks.size > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-900">
            {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('complete', Array.from(selectedTasks))}
              className="px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
            >
              Mark Complete
            </button>
            <button
              onClick={() => onBulkAction('delete', Array.from(selectedTasks))}
              className="px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 rounded-md transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedTasks(new Set())}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {/* Checkbox Column */}
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === tasks.length && tasks.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
              </th>

              {/* Task Column */}
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Task
                  <SortIcon field="title" />
                </div>
              </th>

              {/* Status Column */}
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>

              {/* Priority Column */}
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-2">
                  Priority
                  <SortIcon field="priority" />
                </div>
              </th>

              {/* Due Date Column */}
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('due_date')}
              >
                <div className="flex items-center gap-2">
                  Due Date
                  <SortIcon field="due_date" />
                </div>
              </th>

              {/* Project Column */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Project
              </th>

              {/* Tags Column */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tags
              </th>

              {/* Actions Column */}
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {sortedTasks.map((task) => (
              <tr
                key={task.id}
                onMouseEnter={() => setHoveredRow(task.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`transition-colors ${
                  hoveredRow === task.id ? 'bg-slate-50' : ''
                } ${selectedTasks.has(task.id) ? 'bg-emerald-50' : ''}`}
              >
                {/* Checkbox */}
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(task.id)}
                    onChange={() => handleSelectTask(task.id)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                </td>

                {/* Task Title */}
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskUpdate(task.id, { is_complete: !task.is_complete });
                      }}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {task.is_complete ? (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-300 rounded-full hover:border-emerald-500 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.is_complete ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {getStatusBadge(task.status)}
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  {getPriorityBadge(task.priority)}
                </td>

                {/* Due Date */}
                <td className="px-4 py-3">
                  {task.due_date ? (
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <CalendarIcon className="w-4 h-4" />
                      {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>

                {/* Project */}
                <td className="px-4 py-3">
                  {task.project ? (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.project.color }}
                      />
                      <span className="text-sm text-slate-700">{task.project.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>

                {/* Tags */}
                <td className="px-4 py-3">
                  {task.tags && task.tags.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      {task.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className="text-xs text-slate-500">
                          +{task.tags.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  {hoveredRow === task.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskDelete(task.id);
                      }}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks yet</h3>
          <p className="text-sm text-slate-500">Create your first task to get started</p>
        </div>
      )}
    </div>
  );
}
