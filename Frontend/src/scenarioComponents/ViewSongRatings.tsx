import { useState } from 'react';

function ViewSongRatings() {
    const [songs, setSongs] = useState([])
    const [songID, setSongID] = useState('1')

    const fetchRatings = async () => {
        const res = await fetch (`http://localhost:5000/api/scenarios/song-ratings?songId=${songID}`)
        const data = await res.json()
        setSongs(data)
    }

    return (
    <>
        <input value={songID} onChange={e => setSongID(e.target.value)} />
        <button onClick={fetchRatings}>Search</button>
        <ul>
            {songs.map((song: any, i) => (
                <li key={i}>{song.Title} — {song.Username} — {song.RatingValue}</li>
            ))}
        </ul>
    </>
    )
}

export default ViewSongRatings