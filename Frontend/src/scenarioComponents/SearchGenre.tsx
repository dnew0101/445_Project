import { useState } from 'react';

function SearchGenre() {
  const [songs, setSongs] = useState([])
  const [genre, setGenre] = useState('Pop')

  const fetchSongs = async () => {
    const res = await fetch(`http://localhost:5000/api/scenarios/browse-genre?genre=${genre}`)
    const data = await res.json()
    setSongs(data)
  }

  return (
    <>
      <input value={genre} onChange={e => setGenre(e.target.value)} />
      <button onClick={fetchSongs}>Search</button>

      <ul>
        {songs.map((song: any, i) => (
          <li key={i}>{song.Title} — {song.Artists}</li>
        ))}
      </ul>
    </>
  )
}

export default SearchGenre