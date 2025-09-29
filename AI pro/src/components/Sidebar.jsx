import { useEffect } from 'react'
import './Sidebar.css'

const Sidebar = ({
  conversations,
  searchResults,
  isSearching,
  currentConversationId,
  isMobileOpen,
  onConversationSelect,
  /* onSearch removed - search now handled in SearchPanel */
  onDeleteConversation,
  onMobileClose
}) => {
  const displayItems = isSearching ? searchResults : conversations

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
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(conversationId)
    }
  }

  const handleConversationSelect = (conversationId) => {
    onConversationSelect(conversationId)
    onMobileClose() // Close mobile menu when selecting conversation
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('.sidebar') && !event.target.closest('.history-menu-btn')) {
        onMobileClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileOpen, onMobileClose])

  if (!isMobileOpen) return null;

  return (
    <>
      <div className="sidebar open">
        <div className="sidebar-header minimal-header">
          <span className="sidebar-title">Conversations</span>
        </div>
        <div className="sidebar-content">
          <div className="section-header">
            <span>
              {isSearching ? (
                `Search Results (${searchResults.length})`
              ) : (
                `Recent Conversations (${conversations.length})`
              )}
            </span>
            {/* Search cleared functionality removed with panel approach */}
          </div>
          <div className="conversations-list">
            {displayItems.length === 0 ? (
              <div className="empty-state">
                {isSearching ? (
                  <div>
                    <div className="empty-icon">🔍</div>
                    <p>No conversations found</p>
                    <small>Try different keywords</small>
                  </div>
                ) : (
                  <div>
                    <div className="empty-icon">💬</div>
                    <p>No conversations yet</p>
                    <small>Start a new chat to begin</small>
                  </div>
                )}
              </div>
            ) : (
              displayItems.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`conversation-item ${
                    currentConversationId === conversation._id ? 'active' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation._id)}
                >
                  <div className="conversation-content">
                    <div className="conversation-title">
                      {truncateTitle(conversation.title)}
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Overlay to close sidebar */}
      <div className="mobile-overlay" onClick={onMobileClose} />
    </>
  )
}

export default Sidebar