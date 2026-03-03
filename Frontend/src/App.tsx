import { useState } from 'react';
import './App.css'
import ViewListeningHistory from './scenarioComponents/ViewListeningHistory';
import ChartsTab from './tabs/ChartsTab';
import Login from './Login';
import PlaylistTab from './tabs/PlaylistTab';

function App() {
  const [activeTab, setActiveTab] = useState('searchGenre')
  const [user, setUser] = useState<any>(null)

return (
    <>
      {!user ? <Login onLogin={setUser} /> :
        <div>
          <div className="navbar">
            <button
              className={activeTab === 'songs' ? 'active' : ''}
              onClick={() => setActiveTab('songs')}
            >
              Songs
            </button>
            <button
              className={activeTab === 'playlists' ? 'active' : ''}
              onClick={() => setActiveTab('playlists')}
            >
              Playlists
            </button>
            <button
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
            <button
              className={activeTab === 'charts' ? 'active' : ''}
              onClick={() => setActiveTab('charts')}
            >
              Charts
            </button>
          </div>
          <div className="content">
           
            {activeTab === 'playlists' && <PlaylistTab userID={user.UserID} />}
            {activeTab === 'history' && <ViewListeningHistory userID={user.UserID} />}
            {activeTab === 'charts' && <ChartsTab />}
          </div>
        </div>
      }
    </>
  )
}

export default App

// {activeTab === 'songs' && <SongsTab userID={user.UserID} />}