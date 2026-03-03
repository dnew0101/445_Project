import { useEffect, useState } from 'react';

function ViewListeningHistory({ userID }: { userID: string }) {
    const [songs, setSongs] = useState([])

    const fetchListeningHistory = async () => {
        const res = await fetch(`http://localhost:5000/api/scenarios/user-history?userId=${userID}`)
        const data = await res.json()
        setSongs(data)
    }

    useEffect(() => {
        fetchListeningHistory()
    }, [])

    return (
        <>
        <ul>
            {songs.map((song: any, i) => (
                <li key={i}>{song.Title} — {song.ListeningTimestamp}</li>
            ))}
        </ul>
        </>
    )
}

export default ViewListeningHistory