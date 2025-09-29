import { useState, useEffect, useCallback } from 'react'
import ChatInterface from './components/ChatInterface'
import HamburgerMenu from './components/HamburgerMenu'
import ConversationsList from './components/ConversationsList'
import SearchPanel from './components/SearchPanel'
import Settings from './components/Settings'
import { API_ENDPOINTS } from './config/api'
import './App.css'

function App() {
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isConversationsOpen, setIsConversationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 'medium',
    autoSave: true,
    notifications: true
  })
  
  // Generate unique session ID for conversation management
  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || 
           `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  })

  // Save session ID to localStorage
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId)
  }, [sessionId])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const loadConversations = useCallback(() => {
    // Backend doesn't support conversations endpoint yet
    // Mock recent conversations for demonstration
    const mockConversations = [
      {
        id: '1',
        title: 'React Development Help',
        lastMessage: 'How to optimize React components?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: '2',
        title: 'AI Model Comparison',
        lastMessage: 'What are the differences between GPT and Gemini?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      },
      {
        id: '3',
        title: 'JavaScript Best Practices',
        lastMessage: 'Can you explain async/await?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
      }
    ]
    setConversations(mockConversations)
  }, [])

  // Load conversations on startup
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleNewConversation = () => {
    setCurrentConversationId(null)
    setIsSearching(false)
    setSearchResults([])
    setIsHamburgerOpen(false)
    setIsConversationsOpen(false)
    setIsSearchOpen(false)
    setIsSettingsOpen(false)
  }

  const handleConversationSelect = (conversationId) => {
    setCurrentConversationId(conversationId)
    setIsConversationsOpen(false)
    setIsSearchOpen(false)
    setIsSettingsOpen(false)
    setIsSearching(false)
    setSearchResults([])
  }

  const handleConversationCreate = (conversationId) => {
    setCurrentConversationId(conversationId)
    loadConversations()
  }

  const handleConversationUpdate = () => {
    loadConversations()
  }

  const handleDeleteConversation = (conversationId) => {
    // Backend doesn't support delete endpoint yet
    // For now, just remove from local state
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
    }
  }

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen)
    setIsConversationsOpen(false)
    setIsSearchOpen(false)
    setIsSettingsOpen(false)
  }

  const handleSettingsClick = () => {
    setIsSettingsOpen(true)
    setIsHamburgerOpen(false)
    setIsConversationsOpen(false)
    setIsSearchOpen(false)
  }

  const handleSettingsUpdate = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('appSettings', JSON.stringify(newSettings))
  }

  const handleViewConversations = () => {
    setIsConversationsOpen(true)
    setIsHamburgerOpen(false)
    setIsSearchOpen(false)
    setIsSettingsOpen(false)
  }

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsHamburgerOpen(false)
    setIsConversationsOpen(false)
    setIsSettingsOpen(false)
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Backend doesn't support search endpoint yet
      // For now, just filter local conversations
      const filtered = conversations.filter(c => 
        c.title?.toLowerCase().includes(query.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const closeAllModals = () => {
    setIsHamburgerOpen(false)
    setIsConversationsOpen(false)
    setIsSearchOpen(false)
    setIsSettingsOpen(false)
  }

  return (
    <div className="app">
      {/* Hamburger Menu Dropdown */}
      {isHamburgerOpen && (
        <HamburgerMenu 
          onClose={() => setIsHamburgerOpen(false)}
          onNewConversation={handleNewConversation}
          onViewConversations={handleViewConversations}
          onSearchClick={handleSearchClick}
          onSettingsClick={handleSettingsClick}
          conversations={conversations}
        />
      )}

      {/* Conversations List Modal */}
      {isConversationsOpen && (
        <ConversationsList 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
          onDeleteConversation={handleDeleteConversation}
          onClose={() => setIsConversationsOpen(false)}
        />
      )}

      {/* Search Panel Modal */}
      {isSearchOpen && (
        <SearchPanel 
          onSearch={handleSearch}
          onClose={() => setIsSearchOpen(false)}
          isSearching={isSearching}
          searchResults={searchResults}
          onConversationSelect={handleConversationSelect}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Settings 
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsUpdate={handleSettingsUpdate}
        />
      )}

      {/* Main Chat Interface */}
      <ChatInterface 
        conversationId={currentConversationId}
        sessionId={sessionId}
        onConversationUpdate={handleConversationUpdate}
        onConversationCreate={handleConversationCreate}
        onNewConversation={handleNewConversation}
        onHamburgerClick={handleHamburgerClick}
        onSearchClick={handleSearchClick}
      />

      {/* Background overlay to close modals when clicking outside */}
      {(isHamburgerOpen || isConversationsOpen || isSearchOpen || isSettingsOpen) && (
        <div 
          className="modal-overlay" 
          onClick={closeAllModals}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'transparent',
            zIndex: 999
          }}
        />
      )}
    </div>
  )
}

export default App
