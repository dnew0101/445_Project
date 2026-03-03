import { useState } from 'react'
import * as api from '../api/client'

type AnalyticsType = 'most-played' | 'top-genres' | 'top-rated' | 'top-artists' | 'listening-by-hour';

export default function AnalyticsPanel() {
  const [selectedAnalytic, setSelectedAnalytic] = useState<AnalyticsType>('most-played')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFetch = async () => {
    setLoading(true)
    setError('')
    try {
      let data
      switch (selectedAnalytic) {
        case 'most-played':
          data = await api.getMostPlayedLast30()
          break
        case 'top-genres':
          data = await api.getTopGenres()
          break
        case 'top-rated':
          data = await api.getTopRated()
          break
        case 'top-artists':
          data = await api.getTopArtistsPlays()
          break
        case 'listening-by-hour':
          data = await api.getListeningByHour()
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
      <h2>Analytics</h2>

      <div className="analytics-selector">
        <label>Select Analytics:</label>
        <select value={selectedAnalytic} onChange={(e) => setSelectedAnalytic(e.target.value as AnalyticsType)}>
          <option value="most-played">Most Played Songs (Last 30 Days)</option>
          <option value="top-genres">Most Popular Genres</option>
          <option value="top-rated">Top-Rated Songs</option>
          <option value="top-artists">Top Artists by Plays</option>
          <option value="listening-by-hour">Listening Trends by Hour</option>
        </select>
      </div>

      <button onClick={handleFetch} disabled={loading}>
        {loading ? 'Loading...' : 'Get Data'}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="results">
        {results.length > 0 ? (
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                {selectedAnalytic === 'most-played' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span>Play Count: {item.PlayCount}</span>
                  </>
                )}
                {selectedAnalytic === 'top-genres' && (
                  <>
                    <strong>{item.GenreName}</strong>
                    <br />
                    <span>Total Listens: {item.TotalListens}</span>
                  </>
                )}
                {selectedAnalytic === 'top-rated' && (
                  <>
                    <strong>{item.Title}</strong>
                    <br />
                    <span>Average Rating: {parseFloat(item.AvgRating).toFixed(2)}/5</span>
                    <br />
                    <span>Number of Ratings: {item.NumRatings}</span>
                  </>
                )}
                {selectedAnalytic === 'top-artists' && (
                  <>
                    <strong>{item.ArtistName}</strong>
                    <br />
                    <span>Total Plays: {item.TotalPlays}</span>
                  </>
                )}
                {selectedAnalytic === 'listening-by-hour' && (
                  <>
                    <strong>{item.HourOfDay}:00</strong>
                    <br />
                    <span>Plays: {item.PlayCount}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>Click "Get Data" to load analytics</p>
        )}
      </div>
    </div>
  )
}
