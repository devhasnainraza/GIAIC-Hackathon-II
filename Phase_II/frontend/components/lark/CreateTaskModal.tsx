'use client';

import { useState } from 'react';
import { X, Calendar as CalendarIcon, Flag, FolderOpen, Tag as TagIcon } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: any) => void;
}

/**
 * Lark Base-inspired Create Task Modal
 *
 * Features:
 * - Clean modal design
 * - All task fields (title, description, status, priority, due date, project, tags)
 * - Quick actions
 * - Keyboard shortcuts (Esc to close, Cmd+Enter to save)
 */
export default function CreateTaskModal({ isOpen, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        due_date: dueDate || undefined,
      };

      await onCreate(taskData);

      // Reset form
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  if (!isOpen) return null;

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
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Create New Task</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                autoFocus
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder:text-slate-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-base placeholder:text-slate-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value as any)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                      status === option.value
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value as any)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                      priority === option.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className={priority === option.value ? 'text-white' : option.color}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder:text-slate-500"
                />
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 sm:pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3">Quick Actions</p>
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPriority('urgent');
                    setStatus('todo');
                  }}
                  className="px-3 py-2 sm:py-1.5 bg-red-50 text-red-600 rounded-md text-xs sm:text-xs font-medium hover:bg-red-100 transition-colors touch-manipulation"
                >
                  🔥 Urgent Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setDueDate(today);
                  }}
                  className="px-3 py-2 sm:py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs sm:text-xs font-medium hover:bg-blue-100 transition-colors touch-manipulation"
                >
                  📅 Due Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setDueDate(tomorrow.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 sm:py-1.5 bg-emerald-50 text-emerald-600 rounded-md text-xs sm:text-xs font-medium hover:bg-emerald-100 transition-colors touch-manipulation"
                >
                  ⏰ Due Tomorrow
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 hidden sm:block">
              Press <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">Esc</kbd> to cancel
            </p>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim()}
                className="flex-1 sm:flex-none px-6 py-2.5 sm:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
