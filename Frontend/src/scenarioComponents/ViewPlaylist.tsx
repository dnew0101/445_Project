import { useState } from 'react';

function ViewPlaylist({ playlistID }: { playlistID: string }) {
    const [songs, setSongs] = useState([])

    const fetchPlaylist = async () => {
        const res = await fetch(`http://localhost:5000/api/scenarios/view-playlist?id=${playlistID}`)
        const data = await res.json()
        setSongs(data)
    }

    return (
        <>
        <button onClick={fetchPlaylist}>Search</button>
        <ul>
          {songs.map((song: any, i) => (
            <li key={i}>{song.PlaylistName} — {song.Title} — {song.Position}</li>
            ))}
        </ul>
        </>
    )
}

export default ViewPlaylist