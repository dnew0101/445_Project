import { useState, useEffect } from 'react';

function PlaylistTab({ userID }: { userID: string }) {
    const [playlists, setPlaylists] = useState([])
    const [newPlaylistName, setNewPlaylistName] = useState('')
    const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null)
    const [playlistSongs, setPlaylistSongs] = useState([])

    const fetchPlaylists = async () => {
        const res = await fetch(`http://localhost:5000/api/playlists?userID=${userID}`)
        const data = await res.json()
        setPlaylists(data)
    }

    const createPlaylist = async () => {
        await fetch(`http://localhost:5000/api/playlist/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID, playlistName: newPlaylistName })
        })
        setNewPlaylistName('')
        fetchPlaylists() // refresh the list after creating
    }

    const viewPlaylist = async (playlist: any) => {
        setSelectedPlaylist(playlist)
        const res = await fetch(`http://localhost:5000/api/scenarios/view-playlist?id=${playlist.PlaylistID}`)
        const data = await res.json()
        setPlaylistSongs(data)
    }

    useEffect(() => {
        fetchPlaylists()
    }, [])

    return (
        <div>
            <h2>Your Playlists</h2>

            {/* Create new playlist */}
            <div>
                <input
                    placeholder="New playlist name"
                    value={newPlaylistName}
                    onChange={e => setNewPlaylistName(e.target.value)}
                />
                <button onClick={createPlaylist}>Create Playlist</button>
            </div>

            {/* List of playlists */}
            <ul>
                {playlists.map((playlist: any, i) => (
                    <li key={i}>
                        {playlist.PlaylistName}
                        <button onClick={() => viewPlaylist(playlist)}>View</button>
                    </li>
                ))}
            </ul>

            {/* Songs in selected playlist */}
            {selectedPlaylist && (
                <div>
                    <h3>{selectedPlaylist.PlaylistName}</h3>
                    <ul>
                        {playlistSongs.map((song: any, i) => (
                            <li key={i}>{song.Title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default PlaylistTab