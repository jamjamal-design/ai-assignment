import { useEffect } from 'react'
import './HamburgerMenu.css'

const HamburgerMenu = ({ 
  onClose, 
  onNewConversation, 
  onViewConversations, 
  onSearchClick,
  onSettingsClick,
  conversations = []
}) => {
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.hamburger-menu') && !event.target.closest('.hamburger-button')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const handleItemClick = (action) => {
    action()
    onClose()
  }

  return (
    <>
      <div className="hamburger-menu-overlay" onClick={onClose} />
      <div className="hamburger-menu">
        <div className="hamburger-menu-header">
          <h3>Menu</h3>
          <button className="close-menu-btn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        
        <div className="hamburger-menu-content">
          {/* Main Actions */}
          <div className="menu-section">
            <div className="menu-item" onClick={() => handleItemClick(onNewConversation)}>
              <span className="menu-icon">💬</span>
              <span className="menu-label">New Conversation</span>
            </div>
            
            <div className="menu-item" onClick={() => handleItemClick(onSearchClick)}>
              <span className="menu-icon">🔍</span>
              <span className="menu-label">Search</span>
            </div>
            
            <div className="menu-item" onClick={() => handleItemClick(onViewConversations)}>
              <span className="menu-icon">📋</span>
              <span className="menu-label">All Conversations</span>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="menu-section">
            <h4 className="section-title">Recent Conversations</h4>
            <div className="recent-conversations">
              {conversations.length > 0 ? (
                conversations.slice(0, 4).map(conversation => (
                  <div 
                    key={conversation.id} 
                    className="conversation-item"
                    onClick={() => handleItemClick(() => onViewConversations(conversation.id))}
                  >
                    <div className="conversation-content">
                      <div className="conversation-title">{conversation.title}</div>
                      <div className="conversation-preview">{conversation.lastMessage}</div>
                    </div>
                    <div className="conversation-time">{formatTime(conversation.timestamp)}</div>
                  </div>
                ))
              ) : (
                <div className="no-conversations">No recent conversations</div>
              )}
            </div>
          </div>

          {/* Settings & Help */}
          <div className="menu-section">
            <div className="menu-item" onClick={() => handleItemClick(onSettingsClick)}>
              <span className="menu-icon">⚙️</span>
              <span className="menu-label">Settings</span>
            </div>
            
            <div className="menu-item" onClick={() => handleItemClick(() => window.open('https://help.example.com', '_blank'))}>
              <span className="menu-icon">❓</span>
              <span className="menu-label">Help & Support</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HamburgerMenu