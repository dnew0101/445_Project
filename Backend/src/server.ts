import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend (Vite default port)
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'newman_david_kalcha_joshua_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

//  Scenario Routes (7 scenarios)

// 1. Browse Music by Genre
app.get('/api/scenarios/browse-genre', async (req: Request, res: Response) => {
  const genre = req.query.genre as string || '';
  try {
    const [rows] = await pool.query(
      `SELECT s.Title, GROUP_CONCAT(DISTINCT a.ArtistName SEPARATOR ', ') AS Artists, g.GenreName
       FROM SONG s
       JOIN SONGGENRE sg ON s.SongID = sg.SongID
       JOIN GENRE g ON sg.GenreID = g.GenreID
       JOIN SONGARTIST sa ON s.SongID = sa.SongID
       JOIN ARTIST a ON sa.ArtistID = a.ArtistID
       WHERE g.GenreName LIKE ?
       GROUP BY s.SongID, s.Title, g.GenreName
       ORDER BY s.Title
       LIMIT 20`,
      [`%${genre}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Search for an Artist → albums and songs
app.get('/api/scenarios/search-artist', async (req: Request, res: Response) => {
  const artistName = req.query.name as string;
  if (!artistName) return res.status(400).json({ error: 'Missing artist name' });

  try {
    const [rows] = await pool.query(
      `SELECT a.ArtistName, al.AlbumTitle, al.ReleaseDate, s.Title, s.Duration
       FROM ARTIST a
       LEFT JOIN ALBUM al ON a.ArtistID = al.ArtistID
       LEFT JOIN SONG s ON al.AlbumID = s.AlbumID
       WHERE a.ArtistName LIKE ?
       ORDER BY al.ReleaseDate DESC, s.Title`,
      [`%${artistName}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. View a Playlist (assumes playlist already exists)
app.get('/api/scenarios/view-playlist', async (req: Request, res: Response) => {
  const playlistId = req.query.id as string;
  if (!playlistId) return res.status(400).json({ error: 'Missing playlist ID' });

  try {
    const [rows] = await pool.query(
      `SELECT p.PlaylistName, s.Title, ps.Position
       FROM PLAYLIST p
       JOIN PLAYLISTSONG ps ON p.PlaylistID = ps.PlaylistID
       JOIN SONG s ON ps.SongID = s.SongID
       WHERE p.PlaylistID = ?
       ORDER BY ps.Position`,
      [playlistId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. View Listening History for a User
app.get('/api/scenarios/user-history', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'Missing user ID' });

  try {
    const [rows] = await pool.query(
      `SELECT u.Username, s.Title, lh.ListeningTimestamp
       FROM LISTENINGHISTORY lh
       JOIN USER u ON lh.UserID = u.UserID
       JOIN SONG s ON lh.SongID = s.SongID
       WHERE u.UserID = ?
       ORDER BY lh.ListeningTimestamp DESC
       LIMIT 20`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 5. View Song Ratings
app.get('/api/scenarios/song-ratings', async (req: Request, res: Response) => {
  const songId = req.query.songId as string;
  if (!songId) return res.status(400).json({ error: 'Missing song ID' });

  try {
    const [rows] = await pool.query(
      `SELECT s.Title, u.Username, r.RatingValue
       FROM RATING r
       JOIN SONG s ON r.SongID = s.SongID
       JOIN USER u ON r.UserID = u.UserID
       WHERE s.SongID = ?
       ORDER BY r.RatingValue DESC`,
      [songId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 6. View Liked Songs for a User
app.get('/api/scenarios/user-likes', async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'Missing user ID' });

  try {
    const [rows] = await pool.query(
      `SELECT u.Username, s.Title
       FROM USERLIKE ul
       JOIN USER u ON ul.UserID = u.UserID
       JOIN SONG s ON ul.SongID = s.SongID
       WHERE u.UserID = ?
       ORDER BY s.Title`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 7. View Top Charts
app.get('/api/scenarios/top-charts', async (req: Request, res: Response) => {
  const chartName = req.query.chartName as string || 'Top Songs';

  try {
    const [rows] = await pool.query(
      `SELECT c.ChartName, c.ChartDate, cs.RankNumber, s.Title, GROUP_CONCAT(DISTINCT a.ArtistName SEPARATOR ', ') AS Artists
       FROM CHART c
       JOIN CHARTSONG cs ON c.ChartID = cs.ChartID
       JOIN SONG s ON cs.SongID = s.SongID
       JOIN SONGARTIST sa ON s.SongID = sa.SongID
       JOIN ARTIST a ON sa.ArtistID = a.ArtistID
       WHERE c.ChartName = ?
       GROUP BY cs.RankNumber, s.Title, c.ChartName, c.ChartDate
       ORDER BY cs.RankNumber`,
      [chartName]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

//  Analytical Queries (5)

// 1. Most played songs in the last 30 days
app.get('/api/analytics/most-played-last-30', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.Title, COUNT(*) AS PlayCount
       FROM LISTENINGHISTORY lh
       JOIN SONG s ON lh.SongID = s.SongID
       WHERE lh.ListeningTimestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY s.SongID, s.Title
       ORDER BY PlayCount DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Most popular genres by total listens
app.get('/api/analytics/top-genres', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.GenreName, COUNT(*) AS TotalListens
       FROM LISTENINGHISTORY lh
       JOIN SONG s ON lh.SongID = s.SongID
       JOIN SONGGENRE sg ON s.SongID = sg.SongID
       JOIN GENRE g ON sg.GenreID = g.GenreID
       GROUP BY g.GenreName
       ORDER BY TotalListens DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Top-rated songs by average rating
app.get('/api/analytics/top-rated', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.Title, AVG(r.RatingValue) AS AvgRating, COUNT(r.RatingValue) AS NumRatings
       FROM SONG s
       LEFT JOIN RATING r ON s.SongID = r.SongID
       GROUP BY s.SongID, s.Title
       HAVING NumRatings > 0
       ORDER BY AvgRating DESC, NumRatings DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Artists with highest total song plays
app.get('/api/analytics/top-artists-plays', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.ArtistName, COUNT(*) AS TotalPlays
       FROM LISTENINGHISTORY lh
       JOIN SONG s ON lh.SongID = s.SongID
       JOIN SONGARTIST sa ON s.SongID = sa.SongID
       JOIN ARTIST a ON sa.ArtistID = a.ArtistID
       GROUP BY a.ArtistID, a.ArtistName
       ORDER BY TotalPlays DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 5. Listening trends by time of day
app.get('/api/analytics/listening-by-hour', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT HOUR(lh.ListeningTimestamp) AS HourOfDay, COUNT(*) AS PlayCount
       FROM LISTENINGHISTORY lh
       GROUP BY HourOfDay
       ORDER BY HourOfDay`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Try: http://localhost:5000/health');
  console.log('Try: http://localhost:5000/api/scenarios/browse-genre?genre=Pop');
});