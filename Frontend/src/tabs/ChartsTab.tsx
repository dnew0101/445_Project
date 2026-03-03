import { useState, useEffect } from 'react';

function ChartsTab() {
    const [mostPlayedSongs30, setMostPlayedSongs] = useState([])
    const [mostPopGenres, setMostPopGenres] = useState([])
    const [topRatedSongs, setTopRatedSongs] = useState([])
    const [topArtists, setTopArtists] = useState([])
    const [listeningTrends, setListeningTrends] = useState([])

    useEffect(() => {
        fetchMostPlayedSongs()
        fetchMostPopGenres()
        fetchTopRatedSongs()
        fetchArtistWithHighestPlays()
        fetchListeningTrends()
    }, [])

    const fetchMostPlayedSongs = async () => {
        const res = await fetch(`http://localhost:5000/api/analytics/most-played-last-30`)
        const data = await res.json()
        setMostPlayedSongs(data)
    }

    const fetchMostPopGenres = async () => {
        const res = await fetch(`http://localhost:5000/api/analytics/top-genres`)
        const data = await res.json()
        setMostPopGenres(data)
    }

    const fetchTopRatedSongs = async () => {
        const res = await fetch(`http://localhost:5000/api/analytics/top-rated`)
        const data = await res.json()
        setTopRatedSongs(data)
    }

    const fetchArtistWithHighestPlays = async () => {
        const res = await fetch(`http://localhost:5000/api/analytics/top-artists-plays`)
        const data = await res.json()
        setTopArtists(data)
    }

    const fetchListeningTrends = async () => {
        const res = await fetch(`http://localhost:5000/api/analytics/listening-by-hour`)
        const data = await res.json()
        setListeningTrends(data)
    }

    return (
    <div>
        <h2>Most Played This Month</h2>
        <ul>{mostPlayedSongs30.map(
            (song: any, i) => (
                <li key={i}>{song.Title} — {song.PlayCount}</li>
            )
        )}</ul>

        <h2>Most Popular Genres</h2>
        <ul>{mostPopGenres.map(
            (genre: any, i) => (
                <li key={i}>{genre.GenreName} — {genre.TotalListens}</li>
            )
        )}</ul>

        <h2>Top Rated Songs</h2>
        <ul>{topRatedSongs.map(
            (song: any, i) => (
                <li key={i}>{song.Title} — {song.AvgRating} — {song.NumRatings}</li>
            )
        )}</ul>

        <h2>Artists With Highest Total Song Plays</h2>
        <ul>{topArtists.map(
            (artist: any, i) => (
                <li key={i}>{artist.ArtistName} — {artist.TotalPlays}</li>
            )
        )}</ul>

        <h2>Listening Trends by Time of Day</h2>
        <ul>{listeningTrends.map(
            (trend: any, i) => (
                <li key={i}>{trend.HourOfDay}:00 — {trend.PlayCount} Plays</li>
            )
        )}</ul>
    </div>
  )
}

export default ChartsTab