import { useState, useEffect, useRef } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { API_ENDPOINTS } from '../config/api'
import './ChatInterface.css'

const ChatInterface = ({ 
  conversationId, 
  sessionId, 
  onConversationUpdate, 
  onConversationCreate,
  onNewConversation
}) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [model, setModel] = useState('gemini-2.5-flash')
  const messagesEndRef = useRef(null)

  // Load conversation when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    } else {
      setMessages([])
      setError('')
    }
  }, [conversationId])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversation = async (id) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_ENDPOINTS.conversations}/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.conversation.messages)
        setError('')
      } else {
        setError('Failed to load conversation')
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
      setError('Failed to load conversation')
    } finally {
      setIsLoading(false)
    }
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
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId,
          sessionId,
          model
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add AI response
        setMessages(prev => [...prev, data.message])
        
        // If this was a new conversation, update the conversation ID
        if (!conversationId && data.conversationId) {
          onConversationCreate(data.conversationId)
        }
        
        // Notify parent to update conversation list
        onConversationUpdate()
        
      } else {
        const errorData = await response.json()
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
      <div className="chat-header-row">
        <h1 className="chat-title">Jamal AI Chat Assistant</h1>
        <div className="header-actions">
          <div className="model-select-wrap">
            <label htmlFor="model-select">Model:</label>
            <select
              id="model-select"
              value={model}
              onChange={e => setModel(e.target.value)}
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            </select>
          </div>
        </div>
      </div>

  <div className="chat-content scroll-y">
        {messages.length === 0 && !isLoading ? (
          <div className="welcome-message">
            <div className="welcome-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <h2>Welcome to AI Chat!</h2>
            <p>Start a conversation by typing a message below or select a prompt.</p>
            <div className="suggested-prompts">
              <button 
                className="prompt-btn" 
                onClick={() => sendMessage("What's the weather like today?")}
              >
                What's the weather like today?
              </button>
              <button 
                className="prompt-btn" 
                onClick={() => sendMessage("Explain quantum computing in simple terms")}
              >
                Explain quantum computing in simple terms
              </button>
              <button 
                className="prompt-btn" 
                onClick={() => sendMessage("Write a creative story about space exploration")}
              >
                Write a creative story about space exploration
              </button>
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