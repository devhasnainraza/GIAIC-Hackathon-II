'use client';

import { useState } from 'react';
import { Check, Clock, AlertCircle, Circle, Calendar as CalendarIcon, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '@/lib/types';

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => void;
}

/**
 * Lark Base-inspired Board View (Kanban)
 *
 * Features:
 * - 4 columns: To Do, In Progress, Review, Done
 * - Drag-and-drop between columns
 * - Task cards with priority indicators
 * - Visual feedback during dragging
 * - Responsive design
 */
export default function BoardView({ tasks, onTaskClick, onTaskUpdate }: BoardViewProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const columns = [
    { id: 'todo', label: 'To Do', icon: Circle, color: 'bg-slate-100 border-slate-300' },
    { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'bg-blue-50 border-blue-300' },
    { id: 'review', label: 'Review', icon: AlertCircle, color: 'bg-amber-50 border-amber-300' },
    { id: 'done', label: 'Done', icon: Check, color: 'bg-emerald-50 border-emerald-300' },
  ];

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<string, Task[]>);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedTask && draggedTask.status !== columnId) {
      // Update task status
      onTaskUpdate(draggedTask.id, {
        status: columnId as Task['status'],
        is_complete: columnId === 'done'
      });
    }

    setDraggedTask(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Low', color: 'text-slate-500', bg: 'bg-slate-100' },
      medium: { label: 'Medium', color: 'text-blue-500', bg: 'bg-blue-100' },
      high: { label: 'High', color: 'text-orange-500', bg: 'bg-orange-100' },
      urgent: { label: 'Urgent', color: 'text-red-500', bg: 'bg-red-100' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
        <Flag className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const Icon = column.icon;
        const columnTasks = tasksByStatus[column.id] || [];
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
          >
            {/* Column Header */}
            <div className={`rounded-t-lg border-2 ${column.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-slate-700" />
                  <h3 className="font-semibold text-slate-900">{column.label}</h3>
                </div>
                <span className="px-2 py-1 bg-white rounded-full text-xs font-semibold text-slate-600">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div
              className={`min-h-[500px] border-2 border-t-0 ${column.color} rounded-b-lg p-4 space-y-3 transition-all ${
                isDragOver ? 'bg-slate-100 border-emerald-400' : 'bg-white'
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onTaskClick(task)}
                  className={`bg-white border border-slate-200 rounded-lg p-4 cursor-move hover:shadow-lg transition-all ${
                    draggedTask?.id === task.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Task Title */}
                  <h4 className={`font-medium text-slate-900 mb-2 ${task.is_complete ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h4>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Task Metadata */}
                  <div className="space-y-2">
                    {/* Priority */}
                    <div>
                      {getPriorityBadge(task.priority)}
                    </div>

                    {/* Due Date */}
                    {task.due_date && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}

                    {/* Project */}
                    {task.project && (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: task.project.color }}
                        />
                        <span className="text-xs text-slate-700">{task.project.name}</span>
                      </div>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
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
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
