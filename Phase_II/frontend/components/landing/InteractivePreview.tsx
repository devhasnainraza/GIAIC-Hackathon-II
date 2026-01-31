'use client';

import { useState } from 'react';
import { Plus, Trash2, Check, CheckCircle, Sparkles } from 'lucide-react';

interface DemoTask {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const initialTasks: DemoTask[] = [
  { id: 1, title: 'Review project proposal', completed: true, priority: 'high' },
  { id: 2, title: 'Team meeting at 2 PM', completed: false, priority: 'medium' },
  { id: 3, title: 'Update documentation', completed: false, priority: 'low' },
];

export default function InteractivePreview() {
  const [tasks, setTasks] = useState<DemoTask[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: DemoTask = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        priority: 'medium',
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'low':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Interactive Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            See It In
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500 mt-2">
              Action
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Try our interactive demo. Add, complete, and delete tasks to experience the smooth animations and intuitive interface.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 hover:shadow-emerald-500/10 transition-all duration-500">
            {/* Gradient Border on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

            {/* Demo Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">My Tasks</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {tasks.filter(t => !t.completed).length} active, {tasks.filter(t => t.completed).length} completed
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/30"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/30"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
              </div>
            </div>

            {/* Add Task Input */}
            {isAdding ? (
              <div className="mb-6 animate-slide-in-right">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all duration-300"
                    autoFocus
                  />
                  <button
                    onClick={addTask}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewTaskTitle('');
                    }}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="group w-full mb-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add New Task
              </button>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="group animate-slide-in-right bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-300 hover:bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/30'
                          : 'border-slate-300 hover:border-emerald-500 hover:scale-105'
                      }`}
                    >
                      {task.completed && (
                        <Check className="w-4 h-4 text-white animate-check" strokeWidth={3} />
                      )}
                    </button>

                    {/* Task Title */}
                    <span
                      className={`flex-1 text-slate-700 font-medium transition-all duration-300 ${
                        task.completed ? 'line-through opacity-50' : ''
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Priority Badge */}
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <p className="text-slate-500 font-medium">No tasks yet. Add one to get started!</p>
              </div>
            )}

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-xl">
              <p className="text-sm text-emerald-700 text-center font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                This is a live demo. Try adding, completing, and deleting tasks!
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-b-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
