'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Flag,
  FolderOpen,
  Tag as TagIcon,
  Clock,
  User,
  Trash2,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '@/lib/types';

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: number, updates: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
}

/**
 * Lark Base-inspired Task Detail Panel
 *
 * Features:
 * - Slide-in from right (360px)
 * - Full task details
 * - Inline editing
 * - Status and priority dropdowns
 * - Activity timeline
 */
export default function TaskDetailPanel({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: TaskDetailPanelProps) {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
    }
  }, [task]);

  if (!task) return null;

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate(task.id, { title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (editedDescription !== task.description) {
      onUpdate(task.id, { description: editedDescription.trim() || undefined });
    }
    setIsEditingDescription(false);
  };

  const handleStatusChange = (status: Task['status']) => {
    onUpdate(task.id, { status });
  };

  const handlePriorityChange = (priority: Task['priority']) => {
    onUpdate(task.id, { priority });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-slate-100 text-slate-700' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { value: 'review', label: 'Review', color: 'bg-amber-100 text-amber-700' },
    { value: 'done', label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-slate-500' },
    { value: 'medium', label: 'Medium', color: 'text-blue-500' },
    { value: 'high', label: 'High', color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Completion Checkbox */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdate(task.id, { is_complete: !task.is_complete })}
                className="flex-shrink-0"
              >
                {task.is_complete ? (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-emerald-500 transition-colors" />
                )}
              </button>
              <span className="text-sm text-slate-600">
                {task.is_complete ? 'Completed' : 'Mark as complete'}
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Title
              </label>
              {isEditingTitle ? (
                <div>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') {
                        setEditedTitle(task.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    autoFocus
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-text transition-colors"
                >
                  <p className={`text-sm font-medium ${task.is_complete ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Description
              </label>
              {isEditingDescription ? (
                <div>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onBlur={handleDescriptionSave}
                    rows={4}
                    autoFocus
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-text transition-colors min-h-[80px]"
                >
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                    {task.description || 'Add a description...'}
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value as Task['status'])}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      task.status === option.value
                        ? option.color
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePriorityChange(option.value as Task['priority'])}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      task.priority === option.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className={task.priority === option.value ? 'text-white' : option.color}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Due Date
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
                </span>
              </div>
            </div>

            {/* Project */}
            {task.project && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Project
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: task.project.color }}
                  />
                  <span className="text-sm text-slate-700">{task.project.name}</span>
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Updated {format(new Date(task.updated_at), 'MMM d, yyyy')}</span>
              </div>
              {task.completed_at && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-4 h-4" />
                  <span>Completed {format(new Date(task.completed_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
