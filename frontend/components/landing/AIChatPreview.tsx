'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, CheckSquare, Calendar, BarChart3, Zap } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  taskCard?: {
    title: string;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
  };
  stats?: {
    completed: number;
    inProgress: number;
  };
}

const demoMessages: Message[] = [
  {
    id: 1,
    type: 'ai',
    content: "Hi! I'm your AI Task Assistant. I can help you create tasks, set priorities, track progress, and boost your productivity. What would you like to accomplish today?",
    timestamp: '10:00 AM',
  },
  {
    id: 2,
    type: 'user',
    content: 'Create a high priority task to finish the project proposal by Friday',
    timestamp: '10:01 AM',
  },
  {
    id: 3,
    type: 'ai',
    content: "Perfect! I've created your task with high priority. Here's what I set up:",
    timestamp: '10:01 AM',
    taskCard: {
      title: 'Finish Project Proposal',
      priority: 'high',
      dueDate: 'Friday, Feb 2',
    },
  },
  {
    id: 4,
    type: 'user',
    content: 'Show me my productivity stats for this week',
    timestamp: '10:02 AM',
  },
  {
    id: 5,
    type: 'ai',
    content: "Great progress this week! Here's your productivity overview:",
    timestamp: '10:02 AM',
    stats: {
      completed: 24,
      inProgress: 6,
    },
  },
];

export default function AIChatPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (currentMessageIndex < demoMessages.length) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, demoMessages[currentMessageIndex]]);
          setIsTyping(false);
          setCurrentMessageIndex((prev) => prev + 1);
        }, 1000);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // Reset after all messages shown
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentMessageIndex(0);
      }, 5000);

      return () => clearTimeout(resetTimer);
    }
  }, [currentMessageIndex, messages]);

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

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-purple-50 border border-emerald-200 rounded-full mb-4 shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">AI-Powered Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
            Experience the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-purple-600 mt-2">
              Future of Task Management
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Watch how our AI assistant understands your needs and helps you stay organized. No complex commands, just natural conversation.
          </p>
        </div>

        {/* Chat Interface Demo */}
        <div className="max-w-4xl mx-auto">
          <div className="group relative bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden hover:shadow-emerald-500/20 transition-all duration-500">
            {/* Chat Header */}
            <div className="border-b border-slate-200/50 px-6 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-purple-600 p-6 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <img
                      src="logo 1.png"
                      alt="logo"
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-2xl text-white">
                      Pure Tasks Assistant
                    </h3>
                    <p className="text-xs text-white">{messages.length} messages</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 md:p-8 space-y-4 bg-gradient-to-b from-slate-50 to-white min-h-[500px] max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-right`}
                >
                  <div className={`max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`px-5 py-3 rounded-2xl shadow-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-tr-sm'
                          : 'bg-white border-2 border-slate-200 text-slate-700 rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">{message.content}</p>

                      {/* Task Card */}
                      {message.taskCard && (
                        <div className="mt-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CheckSquare className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 mb-2">{message.taskCard.title}</h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityColor(message.taskCard.priority)}`}>
                                  {message.taskCard.priority.toUpperCase()} PRIORITY
                                </span>
                                {message.taskCard.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-slate-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>{message.taskCard.dueDate}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stats Card */}
                      {message.stats && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-4 text-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <CheckSquare className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">{message.stats.completed}</div>
                            <div className="text-xs text-slate-600 font-medium">Completed</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 text-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600">{message.stats.inProgress}</div>
                            <div className="text-xs text-slate-600 font-medium">In Progress</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs text-slate-500 mt-1 px-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border-2 border-slate-200 px-5 py-3 rounded-2xl rounded-tl-sm shadow-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t-2 border-slate-200">
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border-2 border-slate-200 focus-within:border-emerald-500 transition-all duration-300">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask AI anything... 'Create a task', 'Show my stats', 'What's due today?'"
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  disabled
                />
                <button className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-110 shadow-lg shadow-emerald-500/30">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                This is a live demo. Watch the AI assistant in action!
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-emerald-500 bg-300% animate-gradient"></div>
          </div>

          {/* Feature Pills Below Chat */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Sparkles, text: 'Natural Language Processing', color: 'from-emerald-500 to-emerald-600' },
              { icon: Zap, text: 'Instant Responses', color: 'from-purple-500 to-purple-600' },
              { icon: BarChart3, text: 'Smart Insights', color: 'from-blue-500 to-blue-600' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
