import { useEffect } from 'react'
import './HamburgerMenu.css'

const HamburgerMenu = ({ isOpen, onClose, onNewConversation, onShowConversations }) => {
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.hamburger-menu') && !event.target.closest('.history-menu-btn')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const menuItems = [
    {
      id: 'new-chat',
      label: 'New Conversation',
      icon: '💬',
      action: onNewConversation
    },
    {
      id: 'conversations',
      label: 'View Conversations',
      icon: '📋',
      action: onShowConversations
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: () => console.log('Settings clicked') // Placeholder
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: '❓',
      action: () => console.log('Help clicked') // Placeholder
    }
  ]

  const handleItemClick = (item) => {
    item.action()
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
          <ul className="menu-items">
            {menuItems.map(item => (
              <li key={item.id} className="menu-item" onClick={() => handleItemClick(item)}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default HamburgerMenu