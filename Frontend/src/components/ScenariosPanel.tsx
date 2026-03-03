import { useState } from 'react'
import * as api from '../api/client'

interface SongResult {
  Title: string
  Artists: string
  GenreName: string
}

interface ArtistResult {
  ArtistName: string
  AlbumTitle: string
  ReleaseDate: string
  Title: string
  Duration: number
}

interface PlaylistResult {
  PlaylistName: string
  Title: string
  Position: number
}

type ScenarioType = 'browse-genre' | 'search-artist' | 'view-playlist' | 'user-history' | 'song-ratings' | 'user-likes' | 'top-charts';

export default function ScenariosPanel() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('browse-genre')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Input states for different scenarios
  const [genre, setGenre] = useState('Pop')
  const [artistName, setArtistName] = useState('')
  const [playlistId, setPlaylistId] = useState('')
  const [userId, setUserId] = useState('')
  const [songId, setSongId] = useState('')
  const [chartName, setChartName] = useState('Top Songs')

  const handleFetch = async () => {
    setLoading(true)
    setError('')
    try {
      let data
      switch (selectedScenario) {
        case 'browse-genre':
          data = await api.browseGenre(genre)
          break
        case 'search-artist':
          if (!artistName) {
            setError('Please enter an artist name')
            setLoading(false)
            return
          }
          data = await api.searchArtist(artistName)
          break
        case 'view-playlist':
          if (!playlistId) {
            setError('Please enter a playlist ID')
            setLoading(false)
            return
          }
          data = await api.viewPlaylist(playlistId)
          break
        case 'user-history':
          if (!userId) {
            setError('Please enter a user ID')
            setLoading(false)
            return
          }
          data = await api.getUserHistory(userId)
          break
        case 'song-ratings':
          if (!songId) {
            setError('Please enter a song ID')
            setLoading(false)
            return
          }
          data = await api.getSongRatings(songId)
          break
        case 'user-likes':
          if (!userId) {
            setError('Please enter a user ID')
            setLoading(false)
            return
          }
          data = await api.getUserLikes(userId)
          break
        case 'top-charts':
          data = await api.getTopCharts(chartName)
          break
        default:
          return
      }
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>Scenarios</h2>
      
      <div className="scenario-selector">
        <label>Select Scenario:</label>
        <select value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value as ScenarioType)}>
          <option value="browse-genre">Browse Music by Genre</option>
          <option value="search-artist">Search for an Artist</option>
          <option value="view-playlist">View a Playlist</option>
          <option value="user-history">View Listening History</option>
          <option value="song-ratings">View Song Ratings</option>
          <option value="user-likes">View Liked Songs</option>
          <option value="top-charts">View Top Charts</option>
        </select>
      </div>

      <div className="input-section">
        {selectedScenario === 'browse-genre' && (
          <>
            <input
              type="text"
              placeholder="Enter genre (e.g., Pop, Rock, Jazz)"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
            />
            <p className="hint">Examples: Pop, K-Pop, Hip-Hop, Latin trap</p>
          </>
        )}

        {selectedScenario === 'search-artist' && (
        <>
          <input
            type="text"
            placeholder="Enter artist name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="hint">Examples: Taylor Swift, BTS, The Weeknd, Bad Bunny, Billie Eilish</p>
        </>
        )}

        {selectedScenario === 'view-playlist' && (
        <>
          <input
            type="text"
            placeholder="Enter playlist ID"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="hint">Examples: My Chill Vibes, K-Pop Bangers, Late Night Drive, Summer Latin</p>
        </>
        )}

        {selectedScenario === 'user-history' && (
          <>
          <input
            type="text"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="hint">Example User IDs: 1, 2, 3</p>
          </>
        )}

        {selectedScenario === 'song-ratings' && (
        <>
          <input
            type="text"
            placeholder="Enter song ID"
            value={songId}
            onChange={(e) => setSongId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="hint">Example Song IDs: 1-15</p>
        </>
        )}

        {selectedScenario === 'user-likes' && (
        <>
          <input
            type="text"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="hint">Example User IDs: 1, 2, 3</p>
        </>
        )}

        {selectedScenario === 'top-charts' && (
        <>
          <input
            type="text"
            placeholder="Enter chart name"
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="hint">Example Charts: Billboard Hot 100, Spotify Global Top 50</p>
        </>
        )}

        <button onClick={handleFetch} disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {results.length > 0 ? (
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                {selectedScenario === 'browse-genre' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span className="artists">Artists: {item.Artists}</span>
                    <br />
                    <span className="genre">Genre: {item.GenreName}</span>
                  </>
                )}
                {selectedScenario === 'search-artist' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span>Artist: {item.ArtistName}</span>
                    <br />
                    <span>Album: {item.AlbumTitle}</span>
                  </>
                )}
                {(selectedScenario === 'view-playlist' || selectedScenario === 'top-charts') && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    {item.Artists && <span>Artists: {item.Artists}</span>}
                    {item.RankNumber && <span>Rank: {item.RankNumber}</span>}
                  </>
                )}
                {selectedScenario === 'user-history' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span>User: {item.Username}</span>
                    <br />
                    <span className="timestamp">Listened: {new Date(item.ListeningTimestamp).toLocaleString()}</span>
                  </>
                )}
                {selectedScenario === 'song-ratings' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span>Rating: {item.RatingValue}/5 by {item.Username}</span>
                  </>
                )}
                {selectedScenario === 'user-likes' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span>Liked by: {item.Username}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p style={{ color: "black" }}>Enter search parameters and click Search to see results</p>
        )}
      </div>
    </div>
  )
}
