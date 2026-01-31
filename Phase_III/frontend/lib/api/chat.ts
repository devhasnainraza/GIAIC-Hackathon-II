/**
 * Chat API Client
 *
 * Provides type-safe methods for interacting with the chat API endpoints.
 */

import { ApiError } from '../api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hasnain-raza3-pure-tasks-backend.hf.space';

/**
 * Message interface
 */
export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

/**
 * Conversation summary interface
 */
export interface ConversationSummary {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
  message_count: number;
}

/**
 * Conversation detail interface
 */
export interface ConversationDetail {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

/**
 * Chat request interface
 */
export interface ChatRequest {
  message: string;
  conversation_id?: number | null;
}

/**
 * Chat response interface
 */
export interface ChatResponse {
  conversation_id: number;
  message: Message;
  user_message: Message;
}

/**
 * Conversations list response interface
 */
export interface ConversationsResponse {
  conversations: ConversationSummary[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Make authenticated API request
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'An unexpected error occurred',
      }));

      switch (response.status) {
        case 401:
          throw new ApiError(
            'Your session has expired. Please sign in again.',
            401,
            errorData
          );
        case 403:
          throw new ApiError('Access denied.', 403, errorData);
        case 404:
          throw new ApiError(
            'The requested resource was not found.',
            404,
            errorData
          );
        case 503:
          throw new ApiError(
            'AI service is temporarily unavailable. Please try again later.',
            503,
            errorData
          );
        case 500:
          throw new ApiError(
            'Something went wrong. Please try again later.',
            500,
            errorData
          );
        default:
          throw new ApiError(
            errorData.detail || 'An unexpected error occurred',
            response.status,
            errorData
          );
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Connection lost. Please check your internet connection.',
        undefined,
        error
      );
    }

    throw new ApiError(
      'An unexpected error occurred. Please try again.',
      undefined,
      error
    );
  }
}

/**
 * Chat API client
 */
export const chatApi = {
  /**
   * Send a message to the AI agent
   */
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    return request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List all conversations for the authenticated user
   */
  async listConversations(limit: number = 50, offset: number = 0): Promise<ConversationsResponse> {
    return request<ConversationsResponse>(
      `/api/chat/conversations?limit=${limit}&offset=${offset}`
    );
  },

  /**
   * Get a specific conversation with all messages
   */
  async getConversation(conversationId: number): Promise<ConversationDetail> {
    return request<ConversationDetail>(`/api/chat/conversations/${conversationId}`);
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: number): Promise<void> {
    await request<void>(`/api/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },
};

export default chatApi;
