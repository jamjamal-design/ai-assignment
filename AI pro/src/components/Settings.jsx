import { useState } from 'react'
import './Settings.css'

const Settings = ({ onClose, settings, onSettingsUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    onSettingsUpdate(localSettings)
    onClose()
  }

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: 'medium',
      autoSave: true,
      notifications: true
    }
    setLocalSettings(defaultSettings)
  }

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-settings-btn" onClick={onClose} aria-label="Close settings">✕</button>
        </div>
        
        <div className="settings-content">
          {/* Theme Settings */}
          <div className="setting-group">
            <h3>Appearance</h3>
            
            <div className="setting-item">
              <label>Theme</label>
              <select 
                value={localSettings.theme} 
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Font Size</label>
              <select 
                value={localSettings.fontSize} 
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          {/* General Settings */}
          <div className="setting-group">
            <h3>General</h3>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                />
                Auto-save conversations
              </label>
            </div>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                Enable notifications
              </label>
            </div>
          </div>

          {/* Model Settings */}
          <div className="setting-group">
            <h3>AI Model</h3>
            <div className="setting-item">
              <label>Current Model</label>
              <div className="model-info">
                <span className="model-name">Gemini 2.5 Flash</span>
                <span className="model-description">Latest fast and efficient model for most tasks</span>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="setting-group">
            <h3>Data Management</h3>
            
            <div className="setting-item">
              <button className="action-btn secondary" onClick={() => console.log('Export data')}>
                Export Conversations
              </button>
            </div>
            
            <div className="setting-item">
              <button className="action-btn danger" onClick={() => console.log('Clear data')}>
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="action-btn secondary" onClick={handleReset}>
            Reset to Defaults
          </button>
          <div className="footer-right">
            <button className="action-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="action-btn primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings