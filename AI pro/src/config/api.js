// API Configuration using environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000'
export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/api/ai/chat`,
  conversations: `${API_BASE_URL}/api/ai/conversations`,
  conversationSearch: `${API_BASE_URL}/api/ai/conversations/search`
}