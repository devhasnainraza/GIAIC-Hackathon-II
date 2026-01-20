'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, ArrowRight, CheckSquare, Filter, Loader2 } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client-optimized';
import type { Task } from '@/lib/types';

/**
 * SearchModal Component - Perfect Search Experience
 *
 * Features:
 * - Full-screen modal overlay with responsive design
 * - Large centered search box with auto-focus
 * - Debounced live search for performance
 * - Display matching tasks with highlighted text
 * - Keyboard shortcuts (Cmd/Ctrl + K to open, Escape to close, arrow keys, Enter)
 * - Recent searches with localStorage
 * - Filter by status (All, Active, Completed)
 * - Results count
 * - Empty state with helpful message
 * - Loading states
 * - Mobile-optimized touch interactions
 * - Smooth animations
 */

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'active' | 'completed';

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Load tasks when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTasks();
      loadRecentSearches();
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset state when modal closes
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
      setFilter('all');
    }
  }, [isOpen]);

  // Load tasks from API
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await apiClient.tasks.list();
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load recent searches from localStorage
  const loadRecentSearches = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          setRecentSearches([]);
        }
      }
    }
  };

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Keep only last 5 searches

    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  };

  // Filter tasks based on query and filter
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilteredTasks([]);
      setSelectedIndex(0);
      return;
    }

    const searchQuery = debouncedQuery.toLowerCase();
    let results = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery) ||
      (task.description && task.description.toLowerCase().includes(searchQuery))
    );

    // Apply status filter
    if (filter === 'active') {
      results = results.filter(task => !task.is_complete);
    } else if (filter === 'completed') {
      results = results.filter(task => task.is_complete);
    }

    setFilteredTasks(results);
    setSelectedIndex(0);
  }, [debouncedQuery, tasks, filter]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            Math.min(prev + 1, filteredTasks.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredTasks.length > 0 && selectedIndex >= 0) {
            handleSelectTask(filteredTasks[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTasks, selectedIndex, onClose]);

  // Handle task selection
  const handleSelectTask = (task: Task) => {
    saveRecentSearch(query);
    onClose();
    router.push('/tasks');
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    inputRef.current?.focus();
  };

  // Highlight matched text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 rounded px-0.5">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  if (!isOpen) return null;

  const showResults = debouncedQuery.trim().length > 0;
  const resultsCount = filteredTasks.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="flex min-h-full items-start justify-center p-0 sm:p-4 sm:pt-[10vh]">
        <div
          className="relative bg-white dark:bg-slate-800 shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-2xl border-0 sm:border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="flex-1 text-base sm:text-lg bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-500"
              autoComplete="off"
            />
            {isSearching && (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
            )}
            {query && !isSearching && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 sm:p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="hidden sm:flex p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close search"
            >
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">
                ESC
              </kbd>
            </button>
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </button>
          </div>

          {/* Filters and Results Count */}
          {showResults && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div className="flex gap-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors touch-manipulation ${
                      filter === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors touch-manipulation ${
                      filter === 'active'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors touch-manipulation ${
                      filter === 'completed'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
              </span>
            </div>
          )}

          {/* Results */}
          <div className="max-h-[calc(100vh-280px)] sm:max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              // Loading State
              <div className="py-12 text-center">
                <Loader2 className="inline-block w-8 h-8 text-emerald-500 animate-spin" />
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Loading tasks...</p>
              </div>
            ) : showResults ? (
              // Search Results
              filteredTasks.length === 0 ? (
                // No Results
                <div className="py-12 px-6 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-900 dark:text-white font-semibold mb-1">No tasks found</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Try searching with different keywords or change the filter
                  </p>
                </div>
              ) : (
                // Results List
                <div className="py-2">
                  {filteredTasks.map((task, index) => (
                    <button
                      key={task.id}
                      onClick={() => handleSelectTask(task)}
                      className={`w-full flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all touch-manipulation ${
                        index === selectedIndex
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-transparent'
                      }`}
                    >
                      {/* Task Icon */}
                      <div className={`mt-1 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        task.is_complete
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        <CheckSquare className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          task.is_complete
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`} />
                      </div>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-1">
                          {highlightText(task.title, debouncedQuery)}
                        </h3>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                            {highlightText(task.description, debouncedQuery)}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            task.is_complete
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          }`}>
                            {task.is_complete ? 'Completed' : 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-2 hidden sm:block" />
                    </button>
                  ))}
                </div>
              )
            ) : (
              // Recent Searches
              <div className="py-4 px-4 sm:px-6">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Recent Searches
                      </p>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group touch-manipulation"
                        >
                          <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                            {search}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      Search your tasks
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Start typing to find tasks by title or description
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs">↓</kbd>
                  <span className="ml-1">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs">↵</kbd>
                  <span className="ml-1">Select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-xs">ESC</kbd>
                <span className="ml-1 hidden sm:inline">Close</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
