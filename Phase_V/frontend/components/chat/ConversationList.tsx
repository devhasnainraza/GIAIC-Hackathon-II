'use client';

import { useState, useEffect } from 'react';
import { chatApi, ConversationSummary } from '@/lib/api/chat';
import { ApiError } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { Plus, Search, Clock, MessageSquare, Trash2, Loader2, AlertCircle, X } from 'lucide-react';

interface ConversationListProps {
  onConversationSelect?: (conversationId: number) => void;
  currentConversationId?: number | null;
  isCollapsed?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

/**
 * Modern ConversationList Component
 *
 * Features:
 * - Glassmorphism design
 * - Search and filter functionality
 * - Smooth animations
 * - Modern gradient accents
 */
export default function ConversationList({
  onConversationSelect,
  currentConversationId,
  isCollapsed = false,
  isMobile = false,
  onClose,
}: ConversationListProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'messages'>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterAndSortConversations();
  }, [conversations, searchQuery, sortBy]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await chatApi.listConversations();
      setConversations(response.conversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load conversations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortConversations = () => {
    let filtered = [...conversations];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((conv) =>
        conv.title?.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else {
      filtered.sort((a, b) => b.message_count - a.message_count);
    }

    setFilteredConversations(filtered);
  };

  const handleConversationClick = (conversationId: number) => {
    if (onConversationSelect) {
      onConversationSelect(conversationId);
    } else {
      router.push(`/chat/${conversationId}`);
    }
  };

  const handleNewConversation = () => {
    router.push('/chat');
  };

  const handleDeleteConversation = async (
    conversationId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await chatApi.deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );

      if (conversationId === currentConversationId) {
        router.push('/chat');
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white border-r border-slate-200/50">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white border-r border-slate-200/50">
        <div className="p-6">
          <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">{error}</p>
                <button
                  onClick={loadConversations}
                  className="text-red-600 text-xs mt-2 hover:underline font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white border-r border-slate-200/50">
      {/* Collapsed State - Professional Icon-Only View */}
      {isCollapsed ? (
        <div className="flex flex-col h-full items-center py-4 bg-white overflow-y-auto">
          {/* New Conversation Button - Collapsed */}
          <div className="px-3 mb-4">
            <button
              onClick={handleNewConversation}
              className="group w-11 h-11 bg-white hover:bg-slate-100 border-2 border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 rounded-lg transition-all duration-200 flex items-center justify-center relative shadow-sm hover:shadow-md"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  top: rect.top + rect.height / 2,
                  left: rect.right + 12
                });
                setHoveredId(-1);
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setTooltipPosition(null);
              }}
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Divider */}
          <div className="w-10 h-px bg-slate-200 mb-3"></div>

          {/* Conversation Icons - Collapsed */}
          <div className="flex-1 overflow-y-auto w-full px-3 space-y-1">
            {filteredConversations.slice(0, 15).map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    top: rect.top + rect.height / 2,
                    left: rect.right + 12
                  });
                  setHoveredId(conversation.id);
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setTooltipPosition(null);
                }}
                className={`relative w-full py-2 px-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center group ${
                  conversation.id === currentConversationId
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 mb-1" strokeWidth={2} />
                <span className="text-[9px] font-medium text-slate-500">
                  {formatTimestamp(conversation.updated_at)}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom Section - Collapsed */}
          <div className="px-3 pt-3 border-t border-slate-200 mt-auto">
            <div className="text-xs text-slate-400 text-center font-medium">
              {conversations.length}
            </div>
          </div>

          {/* Fixed Tooltips - Rendered Outside Sidebar */}
          {hoveredId === -1 && tooltipPosition && (
            <div
              className="fixed px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap z-[9999] shadow-xl pointer-events-none"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: 'translateY(-50%)'
              }}
            >
              New chat
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
            </div>
          )}

          {filteredConversations.slice(0, 15).map((conversation) => (
            hoveredId === conversation.id && tooltipPosition && (
              <div
                key={`tooltip-${conversation.id}`}
                className="fixed px-3 py-2 bg-slate-900 text-white text-sm rounded-lg z-[9999] shadow-xl pointer-events-none max-w-xs"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                  transform: 'translateY(-50%)'
                }}
              >
                <div className="font-medium truncate max-w-[200px]">
                  {conversation.title || 'New Conversation'}
                </div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
              </div>
            )
          ))}
        </div>
      ) : (
        /* Expanded State - Full Content */
        <>
          {/* Modern Header */}
          <div className="p-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-md space-y-3">
            {/* Mobile Header with Close Button */}
            {isMobile && (
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            )}

            <button
              onClick={handleNewConversation}
              className="group w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              New chat
            </button>

            {/* Modern Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white"
              />
            </div>

            {/* Modern Sort Options */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  sortBy === 'date'
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Recent
              </button>
              <button
                onClick={() => setSortBy('messages')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  sortBy === 'messages'
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Active
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                {searchQuery ? (
                  <>
                    <p className="text-sm font-medium text-slate-700">No conversations found</p>
                    <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-700">No conversations yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start a new conversation to begin</p>
                  </>
                )}
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`group relative p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                      conversation.id === currentConversationId
                        ? 'bg-slate-200'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className={`font-medium truncate flex-1 text-sm ${
                        conversation.id === currentConversationId
                          ? 'text-slate-900'
                          : 'text-slate-800 group-hover:text-slate-900'
                      }`}>
                        {conversation.title || 'New Conversation'}
                      </h3>
                      <button
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded ml-2"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {conversation.message_count}
                      </span>
                      <span title={getFullTimestamp(conversation.updated_at)}>
                        {formatTimestamp(conversation.updated_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
