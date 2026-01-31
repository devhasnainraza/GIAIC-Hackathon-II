"use client";

import { useState, useEffect, useRef } from "react";
import { chatApi, Message, ChatRequest } from "@/lib/api/chat";
import MessageBubble from "./MessageBubble";
import { ApiError } from "@/lib/api-client";
import { Send, Download, FileJson, Loader2, Sparkles } from "lucide-react";

interface ChatInterfaceProps {
  conversationId?: number | null;
  onConversationCreated?: (conversationId: number) => void;
}

/**
 * Modern ChatInterface Component
 *
 * Features:
 * - Modern glassmorphism design
 * - Gradient accents
 * - Smooth animations
 * - Export functionality
 * - Real-time updates
 */
export default function ChatInterface({
  conversationId,
  onConversationCreated,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(conversationId || null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  const loadConversation = async (convId: number) => {
    try {
      const conversation = await chatApi.getConversation(convId);
      setMessages(conversation.messages);
      setCurrentConversationId(convId);
    } catch (err) {
      console.error("Failed to load conversation:", err);
      setError("Failed to load conversation history");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const messageText = inputMessage.trim();
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    try {
      const request: ChatRequest = {
        message: messageText,
        conversation_id: currentConversationId,
      };

      const response = await chatApi.sendMessage(request);

      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id);
        onConversationCreated?.(response.conversation_id);
      }

      setMessages((prev) => [...prev, response.user_message, response.message]);
    } catch (err) {
      console.error("Failed to send message:", err);

      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to send message. Please try again.");
      }

      setInputMessage(messageText);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleExportConversation = async () => {
    if (!currentConversationId || messages.length === 0) {
      alert("No conversation to export");
      return;
    }

    try {
      const exportText = messages
        .map((msg) => {
          const timestamp = new Date(msg.created_at).toLocaleString();
          const role = msg.role === "user" ? "You" : "AI Assistant";
          return `[${timestamp}] ${role}:/n${msg.content}/n`;
        })
        .join("/n---/n/n");

      const blob = new Blob([exportText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${currentConversationId}-${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export conversation:", err);
      alert("Failed to export conversation");
    }
  };

  const handleExportJSON = async () => {
    if (!currentConversationId || messages.length === 0) {
      alert("No conversation to export");
      return;
    }

    try {
      const exportData = {
        conversation_id: currentConversationId,
        exported_at: new Date().toISOString(),
        message_count: messages.length,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${currentConversationId}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export conversation:", err);
      alert("Failed to export conversation");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 rounded-2xl shadow-xl border border-slate-200/50 backdrop-blur-sm overflow-hidden">
      {/* Modern Header with Glassmorphism */}
      {messages.length > 0 && (
        <div className="border-b border-slate-200/50 px-6 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-purple-600 p-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30"> */}
                {/* <img
                  src="logo 1.png"
                  alt="logo"
                  className="w-10 h-10"
                /> */}
              {/* </div> */}
              {/* <div>
                <h3 className="font-semibold text-lg text-white">
                  Pure Tasks Assistant
                </h3>
                <p className="text-xs text-white">{messages.length} messages</p>
              </div> */}
              <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        {/* <MessageSquare className="w-6 h-6 text-white" /> */}
                        <img src="logo.png" alt="logo" className='w-10 h-10' />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Pure Task Assistant</h3>
                        {/* <p className="text-sm text-emerald-100">Always ready to help</p> */}
                        <p className="text-xs text-white">{messages.length} messages</p>
                      </div>
                    </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportConversation}
                className="group px-4 py-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 flex items-center gap-2 border border-emerald-200/50"
                title="Export as text"
              >
                <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                <span className="hidden sm:inline">TXT</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="group px-4 py-2 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 flex items-center gap-2 border border-blue-200/50"
                title="Export as JSON"
              >
                <FileJson className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 ">
                {/* <Sparkles className="w-10 h-10 text-white" /> */}
                <img
                  src="logo.png"
                  alt="logo"
                  className="w-100 h-100"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Start a Conversation
              </h3>
              <p className="text-sm text-slate-600">
                Ask me anything about your tasks or how I can help you manage
                your work!
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Modern Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200/50 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 text-xs mt-2 hover:underline font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Area with Glassmorphism */}
      <div className="border-t border-slate-200/50 p-6 bg-white/80 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 shadow-sm"
              rows={1}
              disabled={isLoading}
              maxLength={10000}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
              {inputMessage.length}/10k
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="group px-3 py-3 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
