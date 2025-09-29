// API Configuration
// Use production backend URL for deployment, localhost for development
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:9000' 
  : 'https://ai-assignment-1-ojix.onrender.com'

export const API_ENDPOINTS = {
  generate: `${API_BASE_URL}/api/ai/generate`,
  health: `${API_BASE_URL}/health`
}