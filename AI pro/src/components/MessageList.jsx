import { useState } from 'react'
import './MessageList.css'
import './bubbles.css'

const MessageList = ({ messages, isLoading }) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null)

  const copyToClipboard = async (text, messageIndex) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageIndex)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatMessage = (content) => {
    // Simple markdown-like formatting for better display
    return content
      .split('\n')
      .map((line, index) => {
        // Handle code blocks
        if (line.startsWith('```')) {
          return <div key={index} className="code-delimiter">{line}</div>
        }
        
        // Handle bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return <div key={index} className="bullet-point">{line}</div>
        }
        
        // Handle numbered lists
        if (/^\d+\./.test(line.trim())) {
          return <div key={index} className="numbered-point">{line}</div>
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index}>{line}</p>
        }
        
        // Empty lines
        return <br key={index} />
      })
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.role}`}
        >
          <div className="message-avatar">
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          
          <div className="message-content">
            <div className="message-header">
              <span className="message-role">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </span>
              <span className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            
            <div className={`message-text bubble ${message.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              {formatMessage(message.content)}
            </div>
            
            <div className="message-actions">
              <button
                className={`copy-btn ${copiedMessageId === index ? 'copied' : ''}`}
                onClick={() => copyToClipboard(message.content, index)}
                title="Copy message"
              >
                {copiedMessageId === index ? '✅' : '📋'}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="message assistant loading">
          <div className="message-avatar">🤖</div>
          <div className="message-content">
            <div className="message-header">
              <span className="message-role">AI Assistant</span>
              <span className="message-timestamp">Now</span>
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList