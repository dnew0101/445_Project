import { useState } from 'react';

function ViewTopCharts() {
    const [songs, setSongs] = useState([])
    const [chartName, setChartName] = useState('Billboard Hot 100')
    
    const fetchTopCharts = async () => {
        const res = await fetch(`http://localhost:5000/api/scenarios/top-charts?chartName=${chartName}`)
        const data = await res.json()
        setSongs(data)
    }

    return (
    <>
        <input value={chartName} onChange={e => setChartName(e.target.value)} />
        <button onClick={fetchTopCharts}>Search</button>

        <ul>
            {songs.map((song: any, i) => (
            <li key={i}>{song.Title} — {song.Artists}</li>
            ))}
        </ul>
    </>
    )
}

export default ViewTopCharts