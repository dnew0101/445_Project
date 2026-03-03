import { useState } from 'react'
import './App.css'
import ScenariosPanel from './components/ScenariosPanel'
import AnalyticsPanel from './components/AnalyticsPanel'

function App() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'analytics'>('scenarios')

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Music Database Explorer</h1>
      </header>

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          Scenarios
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'scenarios' && <ScenariosPanel />}
        {activeTab === 'analytics' && <AnalyticsPanel />}
      </div>
    </div>
  )
}

export default App
