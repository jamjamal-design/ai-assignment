import { useState, useEffect } from 'react'
import './SearchPanel.css'

const SearchPanel = ({
  isOpen,
  onClose,
  onSearch,
  conversations,
  searchResults,
  isSearching,
  onSelectConversation
}) => {
  const [query, setQuery] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(t)
  }, [query, onSearch])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const list = isSearching ? searchResults : conversations

  const truncate = (text, len = 60) => text?.length > len ? text.slice(0, len) + '...' : text

  return (
    <div className="search-panel-overlay" onClick={onClose}>
      <div className="search-panel" onClick={e => e.stopPropagation()}>
        <div className="search-panel-header">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="search-panel-input"
          />
          <button className="close-search-btn" onClick={onClose} aria-label="Close search">✕</button>
        </div>
        <div className="search-panel-body scroll-y">
          {list.length === 0 ? (
            <div className="empty-state">
              {isSearching ? 'No matches found' : 'No conversations yet'}
            </div>
          ) : (
            <ul className="results-list">
              {list.map(c => (
                <li key={c._id} className="result-item" onClick={() => { onSelectConversation(c._id); onClose(); }}>
                  <div className="result-title">{truncate(c.title || 'Untitled Conversation', 48)}</div>
                  {c.messages?.length > 0 && (
                    <div className="result-preview">{truncate(c.messages[c.messages.length - 1].content)}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPanel