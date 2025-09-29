import { useEffect } from 'react'
import './ConversationsList.css'

const ConversationsList = ({ 
  isOpen, 
  onClose, 
  conversations, 
  currentConversationId, 
  onConversationSelect, 
  onDeleteConversation 
}) => {

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.conversations-list-panel') && !event.target.closest('.history-menu-btn')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const truncateTitle = (title, maxLength = 40) => {
    return title?.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(conversationId)
    }
  }

  const handleConversationSelect = (conversationId) => {
    onConversationSelect(conversationId)
    onClose()
  }

  return (
    <>
      <div className="conversations-overlay" onClick={onClose} />
      <div className="conversations-list-panel">
        <div className="conversations-header">
          <h3>Recent Conversations ({conversations.length})</h3>
          <button className="close-conversations-btn" onClick={onClose} aria-label="Close conversations">✕</button>
        </div>
        
        <div className="conversations-content scroll-y">
          {conversations.length === 0 ? (
            <div className="empty-conversations">
              <div className="empty-icon">💬</div>
              <p>No conversations yet</p>
              <small>Start a new chat to begin</small>
            </div>
          ) : (
            <ul className="conversations-list">
              {conversations.map((conversation) => (
                <li
                  key={conversation._id}
                  className={`conversation-item ${
                    currentConversationId === conversation._id ? 'active' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation._id)}
                >
                  <div className="conversation-content">
                    <div className="conversation-title">
                      {truncateTitle(conversation.title || 'Untitled Conversation')}
                    </div>
                    <div className="conversation-preview">
                      {conversation.messages && conversation.messages.length > 0 && 
                        truncateTitle(
                          conversation.messages[conversation.messages.length - 1]?.content || '', 
                          60
                        )
                      }
                    </div>
                    <div className="conversation-date">
                      {formatDate(conversation.updatedAt)}
                    </div>
                  </div>
                  <button
                    className="delete-conversation-btn"
                    onClick={(e) => handleDeleteClick(e, conversation._id)}
                    title="Delete conversation"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default ConversationsList