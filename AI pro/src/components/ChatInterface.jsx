import { useState, useEffect, useRef } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { API_ENDPOINTS } from '../config/api'
import './ChatInterface.css'

const ChatInterface = ({ 
  conversationId, 
  // sessionId, 
  onConversationUpdate, 
  // onConversationCreate,
  onNewConversation
}) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const model = 'gemini-2.5-flash' // Fixed model
  const messagesEndRef = useRef(null)

  // Initialize empty messages
  useEffect(() => {
    setMessages([])
    setError('')
  }, [conversationId])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }



  const sendMessage = async (message) => {
    if (!message.trim()) return

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }

    // Add user message immediately for better UX
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(API_ENDPOINTS.generate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: message,
          model
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add AI response - the backend returns { success: true, text: "...", model: "...", ... }
        const aiMessage = {
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toISOString()
        }
        
        setMessages(prev => [...prev, aiMessage])
        
        // Notify parent to update conversation list if callback exists
        if (onConversationUpdate) {
          onConversationUpdate()
        }
        
      } else {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: 'Failed to send message' }
        }
        setError(errorData.message || 'Failed to send message')
        
        // Remove the user message if sending failed
        setMessages(prev => prev.slice(0, -1))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Network error. Please try again.')
      
      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const retryLastMessage = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')
      if (lastUserMessage) {
        sendMessage(lastUserMessage.content)
      }
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="header-left">
          {/* Left side - empty for floating hamburger */}
        </div>
        
        <div className="header-center">
          <h1 className="header-title">AI Assistant</h1>
          <span className="model-badge">Gemini 1.5 Flash</span>
        </div>
        
        <div className="header-right">
          {/* Model is now fixed to gemini-1.5-flash */}
        </div>
      </div>

      <div className="chat-content">
        {messages.length === 0 && !isLoading ? (
          <div className="welcome-screen">
            <h2 className="welcome-title">Welcome to AI Assistant</h2>
            <p className="welcome-subtitle">
              Your intelligent companion for conversations, creative writing, problem-solving, and more.
            </p>
            
            <div className="welcome-features">
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3 className="feature-title">Natural Conversations</h3>
                <p className="feature-description">
                  Engage in meaningful dialogues with advanced AI that understands context and nuance.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">✨</div>
                <h3 className="feature-title">Creative Writing</h3>
                <p className="feature-description">
                  Get help with stories, poems, essays, and any creative writing projects.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3 className="feature-title">Problem Solving</h3>
                <p className="feature-description">
                  Tackle complex problems with AI-powered analysis and step-by-step solutions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            isLoading={isLoading}
          />
        )}
        
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={retryLastMessage} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        onSendMessage={sendMessage} 
        disabled={isLoading}
        onNewConversation={onNewConversation}
      />
    </div>
  )
}

export default ChatInterface