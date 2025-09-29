import { useState, useRef, useEffect } from 'react'
import './MessageInput.css'


const MessageInput = ({ onSendMessage, disabled = false, onNewConversation }) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    // Send on Enter (but not when composing or with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-wrapper">
          <button
            type="button"
            onClick={onNewConversation}
            className="new-chat-button-input"
            title="New Chat"
          >
            +
          </button>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={disabled ? "AI is thinking..." : "Type your message... (Press Enter to send, Shift+Enter for new line)"}
            disabled={disabled}
            className="message-textarea"
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="send-button"
            title="Send message"
          >
            {disabled ? (
              <div className="spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </div>
        
        <div className="input-footer">
          <span className="character-count">
            {message.length > 0 && `${message.length} characters`}
          </span>
          <span className="input-hint">
            Press Enter to send • Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  )
}

export default MessageInput