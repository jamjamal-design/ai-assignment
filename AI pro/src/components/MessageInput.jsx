import { useState } from 'react'
import './MessageInput.css'

const MessageInput = ({ onSendMessage, disabled, onNewConversation }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="message-input-container">
      <button
        className="new-conversation-btn"
        onClick={onNewConversation}
        title="New Conversation"
        disabled={disabled}
      >
        <span className="plus-icon">+</span>
      </button>
      
      <div className="message-input-wrapper">
        <textarea
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={disabled}
          rows={2}
        />
        <button
          type="button"
          className="send-button"
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MessageInput