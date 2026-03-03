import { useState } from 'react';

function ViewLikedSongs({ userID }: { userID: string }) {
    const [songs, setSongs] = useState([])

    const fetchLikedSongs = async () => {
        const res = await fetch(`http://localhost:5000/api/scenarios/user-likes?userId=${userID}`)
        const data = await res.json()
        setSongs(data)
    }

    return (
        <>
            <button onClick={fetchLikedSongs}>liked Songs</button>

            <ul>
                {songs.map((song: any, i) => (
                    <li key={i}>{song.Username} — {song.Title}</li>
                ))}
            </ul>
        </>
    )
}

export default ViewLikedSongs