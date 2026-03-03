const API_BASE_URL = 'http://localhost:5000';

// Scenario Queries
export const browseGenre = (genre: string) =>
  fetch(`${API_BASE_URL}/api/scenarios/browse-genre?genre=${encodeURIComponent(genre)}`).then(r => r.json());

export const searchArtist = (name: string) =>
  fetch(`${API_BASE_URL}/api/scenarios/search-artist?name=${encodeURIComponent(name)}`).then(r => r.json());

export const viewPlaylist = (id: string) =>
  fetch(`${API_BASE_URL}/api/scenarios/view-playlist?id=${encodeURIComponent(id)}`).then(r => r.json());

export const getUserHistory = (userId: string) =>
  fetch(`${API_BASE_URL}/api/scenarios/user-history?userId=${encodeURIComponent(userId)}`).then(r => r.json());

export const getSongRatings = (songId: string) =>
  fetch(`${API_BASE_URL}/api/scenarios/song-ratings?songId=${encodeURIComponent(songId)}`).then(r => r.json());

export const getUserLikes = (userId: string) =>
  fetch(`${API_BASE_URL}/api/scenarios/user-likes?userId=${encodeURIComponent(userId)}`).then(r => r.json());

export const getTopCharts = (chartName: string = 'Top Songs') =>
  fetch(`${API_BASE_URL}/api/scenarios/top-charts?chartName=${encodeURIComponent(chartName)}`).then(r => r.json());

// Analytics Queries
export const getMostPlayedLast30 = () =>
  fetch(`${API_BASE_URL}/api/analytics/most-played-last-30`).then(r => r.json());

export const getTopGenres = () =>
  fetch(`${API_BASE_URL}/api/analytics/top-genres`).then(r => r.json());

export const getTopRated = () =>
  fetch(`${API_BASE_URL}/api/analytics/top-rated`).then(r => r.json());

export const getTopArtistsPlays = () =>
  fetch(`${API_BASE_URL}/api/analytics/top-artists-plays`).then(r => r.json());

export const getListeningByHour = () =>
  fetch(`${API_BASE_URL}/api/analytics/listening-by-hour`).then(r => r.json());
