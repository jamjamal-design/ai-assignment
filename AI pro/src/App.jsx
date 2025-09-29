import { useState, useEffect, useCallback } from 'react'
import ChatInterface from './components/ChatInterface'
import HamburgerMenu from './components/HamburgerMenu'
import ConversationsList from './components/ConversationsList'
import SearchPanel from './components/SearchPanel'
import { API_ENDPOINTS } from './config/api'
import './App.css'

function App() {
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isConversationsOpen, setIsConversationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || 
           `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  })

  // Save session ID to localStorage
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId)
  }, [sessionId])

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.conversations}?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }, [sessionId])

  // Load conversations on startup
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleNewConversation = () => {
    setCurrentConversationId(null)
    setIsSearching(false)
    setSearchResults([])
  }

  const handleConversationSelect = (conversationId) => {
    setCurrentConversationId(conversationId)
    setIsSearching(false)
    setSearchResults([])
  }

  const handleConversationUpdate = () => {
    loadConversations()
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `${API_ENDPOINTS.conversationSearch}?q=${encodeURIComponent(query)}`
      )
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.conversations)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    }
  }

  const handleDeleteConversation = async (conversationId) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.conversations}/${conversationId}`,
        { method: 'DELETE' }
      )
      if (response.ok) {
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null)
        }
        loadConversations()
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const handleShowConversations = () => {
    setIsConversationsOpen(true)
    setIsHamburgerOpen(false)
  }

  return (
  <div className="app">
      <div className="floating-controls">
        <button 
          className="history-menu-btn"
          onClick={() => { 
            setIsHamburgerOpen(!isHamburgerOpen); 
            setIsSearchOpen(false); 
            setIsConversationsOpen(false); 
          }}
          title="Menu"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ☰
        </button>
        <button
          className="search-toggle-btn"
          onClick={() => { 
            setIsSearchOpen(prev => !prev); 
            setIsHamburgerOpen(false); 
            setIsConversationsOpen(false); 
          }}
          title="Search conversations"
        >
          🔍
        </button>
      </div>
      
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        onNewConversation={handleNewConversation}
        onShowConversations={handleShowConversations}
      />
      
      <ConversationsList
        isOpen={isConversationsOpen}
        onClose={() => setIsConversationsOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onDeleteConversation={handleDeleteConversation}
      />
      
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        conversations={conversations}
        searchResults={searchResults}
        isSearching={isSearching}
        onSelectConversation={handleConversationSelect}
      />
      
      <div className="main-content">
        <ChatInterface
          conversationId={currentConversationId}
          sessionId={sessionId}
          onConversationUpdate={handleConversationUpdate}
          onConversationCreate={setCurrentConversationId}
          onNewConversation={handleNewConversation}
        />
      </div>
    </div>
  )
}

export default App
