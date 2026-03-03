import { useState } from 'react';

// A compontent for searching all songs by artist name 
function SearchArtist() {
const [songs, setSongs] = useState([])
const [artist, setArtist] = useState('Taylor Swift')

    const fetchArtists = async () => {
        const res = await fetch(`http://localhost:5000/api/scenarios/search-artist?name=${artist}`)
        const data = await res.json()
        setSongs(data)
    }

    return (
        <>
        <input value={artist} onChange={e => setArtist(e.target.value)} />
        <button onClick={fetchArtists}>Search</button>
        <ul>
          {songs.map((song: any, i) => (
            <li key={i}>{song.Title}  — {song.AlbumTitle} — {song.ReleaseDate} — {song.Duration} — {song.ArtistName}</li>
          ))}
        </ul>
        </>
    )
}

export default SearchArtist