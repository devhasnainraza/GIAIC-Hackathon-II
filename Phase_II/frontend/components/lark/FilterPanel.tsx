'use client';

import { useState, useEffect } from 'react';
import { X, Check, Calendar, Flag, Circle, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FilterOptions {
  status: string[];
  priority: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'overdue' | 'custom';
  customDateStart: string | undefined;
  customDateEnd: string | undefined;
  projects: number[];
  tags: number[];
  completionStatus: 'all' | 'complete' | 'incomplete';
}

interface Project {
  id: number;
  name: string;
  color: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  projects?: Project[];
  tags?: Tag[];
  activeFilters: FilterOptions;
}

/**
 * Lark Base-inspired Filter Panel
 *
 * Features:
 * - Slide-in panel from right
 * - Multiple filter categories
 * - Active filter indicators
 * - Clear all filters
 * - Real-time filter count
 */
export default function FilterPanel({
  isOpen,
  onClose,
  onApplyFilters,
  projects = [],
  tags = [],
  activeFilters,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>(activeFilters);

  // Update local state when activeFilters change
  useEffect(() => {
    setFilters(activeFilters);
  }, [activeFilters]);

  // Status options
  const statusOptions = [
    { value: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-500' },
    { value: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
    { value: 'review', label: 'Review', icon: AlertCircle, color: 'text-amber-500' },
    { value: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-slate-500' },
    { value: 'medium', label: 'Medium', color: 'text-blue-500' },
    { value: 'high', label: 'High', color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' },
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'custom', label: 'Custom Range' },
  ];

  // Toggle status filter
  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  // Toggle priority filter
  const togglePriority = (priority: string) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  // Toggle project filter
  const toggleProject = (projectId: number) => {
    setFilters(prev => ({
      ...prev,
      projects: prev.projects.includes(projectId)
        ? prev.projects.filter(p => p !== projectId)
        : [...prev.projects, projectId],
    }));
  };

  // Toggle tag filter
  const toggleTag = (tagId: number) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      status: [],
      priority: [],
      dateRange: 'all',
      customDateStart: undefined,
      customDateEnd: undefined,
      projects: [],
      tags: [],
      completionStatus: 'all',
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  // Count active filters
  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    (filters.dateRange !== 'all' ? 1 : 0) +
    filters.projects.length +
    filters.tags.length +
    (filters.completionStatus !== 'all' ? 1 : 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Status</h3>
              <div className="space-y-2">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = filters.status.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleStatus(option.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Icon className={`w-4 h-4 ${option.color}`} />
                      <span className="text-sm font-medium text-slate-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Priority</h3>
              <div className="space-y-2">
                {priorityOptions.map((option) => {
                  const isSelected = filters.priority.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      onClick={() => togglePriority(option.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Flag className={`w-4 h-4 ${option.color}`} />
                      <span className="text-sm font-medium text-slate-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Due Date</h3>
              <div className="space-y-2">
                {dateRangeOptions.map((option) => {
                  const isSelected = filters.dateRange === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFilters(prev => ({ ...prev, dateRange: option.value as any }))
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Date Range Inputs */}
              {filters.dateRange === 'custom' && (
                <div className="mt-3 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.customDateStart || ''}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, customDateStart: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.customDateEnd || ''}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, customDateEnd: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Completion Status Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Completion Status
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Tasks' },
                  { value: 'complete', label: 'Completed' },
                  { value: 'incomplete', label: 'Incomplete' },
                ].map((option) => {
                  const isSelected = filters.completionStatus === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFilters(prev => ({
                          ...prev,
                          completionStatus: option.value as any,
                        }))
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Projects Filter */}
            {projects.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Projects</h3>
                <div className="space-y-2">
                  {projects.map((project) => {
                    const isSelected = filters.projects.includes(project.id);

                    return (
                      <button
                        key={project.id}
                        onClick={() => toggleProject(project.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {project.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Tags</h3>
                <div className="space-y-2">
                  {tags.map((tag) => {
                    const isSelected = filters.tags.includes(tag.id);

                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-200 space-y-2">
            <button
              onClick={handleApplyFilters}
              className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
