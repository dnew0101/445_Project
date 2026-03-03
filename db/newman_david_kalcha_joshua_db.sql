-- newman_david_kalcha_joshua_db.sql
-- Music Catalog & Streaming Database - Full Setup + Queries
-- Group 5: Joshua Kalcha, David Newman

-- 1. Drop and recreate database
DROP DATABASE IF EXISTS newman_david_kalcha_joshua_db; -- delete old database if it exists; allows for iterative testing
CREATE DATABASE newman_david_kalcha_joshua_db; -- create database
USE newman_david_kalcha_joshua_db; -- use database

-- 2. Create tables
CREATE TABLE LANGUAGE (
    LanguageID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- Auto-increment for unique PK
    LanguageName VARCHAR(50) NOT NULL UNIQUE -- English, Spanish, etc. unique reinforces non-duplicate languages
);

CREATE TABLE ARTIST (
    ArtistID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    ArtistName VARCHAR(100) NOT NULL,
    Country VARCHAR(50),
    DebutYear YEAR
);

CREATE TABLE GENRE (
    GenreID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    GenreName VARCHAR(50) NOT NULL UNIQUE, -- unique to reinforce non-duplicates
    Description TEXT -- basic description of genre qualities
);

CREATE TABLE ALBUM (
    AlbumID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    AlbumTitle VARCHAR(150) NOT NULL,
    ReleaseDate DATE,
    ArtistID INT UNSIGNED NOT NULL,
    FOREIGN KEY (ArtistID) REFERENCES ARTIST(ArtistID) ON DELETE RESTRICT -- remove all references to an artist if it is removed
);

CREATE TABLE RECORDLABEL (
    LabelID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    LabelName VARCHAR(100) NOT NULL, -- not optional
    Country VARCHAR(50) -- optional 
);

CREATE TABLE CHART ( -- charts native to the app; defined by the queries that call it
    ChartID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ChartName VARCHAR(100) NOT NULL,
    ChartDate DATE NOT NULL -- date of access
);

CREATE TABLE USER ( -- user of the application
    UserID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE, -- users cannot have the same username
    Email VARCHAR(100) NOT NULL UNIQUE -- users cannot have the same email
);

CREATE TABLE SONG (
    SongID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Duration INT UNSIGNED NOT NULL CHECK (Duration > 0), -- length of song cannot be 0 or lower
    ReleaseDate DATE,
    AlbumID INT UNSIGNED,
    LanguageID INT UNSIGNED NOT NULL,
    FOREIGN KEY (AlbumID) REFERENCES ALBUM(AlbumID) ON DELETE SET NULL, -- set null, as songs can exist without album, if the album is deleted (singles)
    FOREIGN KEY (LanguageID) REFERENCES LANGUAGE(LanguageID) ON DELETE RESTRICT -- clean up children first
);

CREATE TABLE SONGARTIST (
    SongID INT UNSIGNED NOT NULL,
    ArtistID INT UNSIGNED NOT NULL,
    PRIMARY KEY (SongID, ArtistID),
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE, -- if a song is deleted, delete all in SONGARTIST's rows
    FOREIGN KEY (ArtistID) REFERENCES ARTIST(ArtistID) ON DELETE CASCADE -- if an artist is deleted, delete all in SONGARTIST's rows too
);

CREATE TABLE SONGGENRE (
    SongID INT UNSIGNED NOT NULL,
    GenreID INT UNSIGNED NOT NULL,
    PRIMARY KEY (SongID, GenreID),
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE,
    FOREIGN KEY (GenreID) REFERENCES GENRE(GenreID) ON DELETE CASCADE
);

CREATE TABLE ARTISTLABEL (
    ArtistID INT UNSIGNED NOT NULL,
    LabelID INT UNSIGNED NOT NULL,
    PRIMARY KEY (ArtistID, LabelID),
    FOREIGN KEY (ArtistID) REFERENCES ARTIST(ArtistID) ON DELETE CASCADE,
    FOREIGN KEY (LabelID) REFERENCES RECORDLABEL(LabelID) ON DELETE CASCADE
);

CREATE TABLE CHARTSONG (
    ChartID INT UNSIGNED NOT NULL,
    SongID INT UNSIGNED NOT NULL,
    RankNumber INT UNSIGNED NOT NULL, -- Changed name, as "rank" was a reserved word
    PRIMARY KEY (ChartID, SongID),
    UNIQUE KEY unique_rank_per_chart (ChartID, RankNumber),
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE,
    FOREIGN KEY (ChartID) REFERENCES CHART(ChartID) ON DELETE CASCADE
);

CREATE TABLE PLAYLIST (
    PlaylistID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    PlaylistName VARCHAR(100) NOT NULL,
    DateCreated DATE NOT NULL,
    UserID INT UNSIGNED NOT NULL, -- Playlists belong to users
    FOREIGN KEY (UserID) REFERENCES USER(UserID) ON DELETE CASCADE
);

CREATE TABLE PLAYLISTSONG (
    PlaylistID INT UNSIGNED NOT NULL,
    SongID INT UNSIGNED NOT NULL,
    Position INT UNSIGNED NOT NULL,
    PRIMARY KEY (PlaylistID, SongID),
    UNIQUE KEY unique_position_per_playlist (PlaylistID, Position),
    FOREIGN KEY (PlaylistID) REFERENCES PLAYLIST(PlaylistID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE
);

CREATE TABLE LISTENINGHISTORY (
    HistoryID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    UserID INT UNSIGNED NOT NULL,
    SongID INT UNSIGNED NOT NULL,
    ListeningTimestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES USER(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE
);

CREATE TABLE RATING (
    UserID INT UNSIGNED NOT NULL,
    SongID INT UNSIGNED NOT NULL,
    RatingValue TINYINT UNSIGNED NOT NULL CHECK (RatingValue BETWEEN 1 AND 5), -- rating value can only be between 1 and 5
    PRIMARY KEY (UserID, SongID),
    FOREIGN KEY (UserID) REFERENCES USER(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE
);

CREATE TABLE USERLIKE (
    UserID INT UNSIGNED NOT NULL,
    SongID INT UNSIGNED NOT NULL,
    PRIMARY KEY (UserID, SongID),
    FOREIGN KEY (UserID) REFERENCES USER(UserID) ON DELETE CASCADE,
    FOREIGN KEY (SongID) REFERENCES SONG(SongID) ON DELETE CASCADE
);

-- 3. Insertions
-- Languages
INSERT INTO LANGUAGE (LanguageName) VALUES ('English'), ('Korean'), ('Spanish');

-- Artists
INSERT INTO ARTIST (ArtistName, Country, DebutYear) VALUES
('Taylor Swift', 'USA', 2006),
('BTS', 'South Korea', 2013),
('The Weeknd', 'Canada', 2010),
('Bad Bunny', 'Puerto Rico', 2016),
('Billie Eilish', 'USA', 2015);

-- Genres
INSERT INTO GENRE (GenreName, Description) VALUES
('Pop', 'Catchy mainstream music'),
('K-Pop', 'Korean idol/pop music'),
('R&B / Hip-Hop', 'Rhythm, blues and rap influences'),
('Latin Trap', 'Latin urban music with trap elements');

-- Record Labels
INSERT INTO RECORDLABEL (LabelName, Country) VALUES
('Republic Records', 'USA'),
('HYBE Labels', 'South Korea'),
('XO Records', 'Canada'),
('Rimas Entertainment', 'Puerto Rico');

-- Artist-Label links
INSERT INTO ARTISTLABEL (ArtistID, LabelID) VALUES (1,1), (2,2), (3,3), (4,4);

-- Albums
INSERT INTO ALBUM (AlbumTitle, ReleaseDate, ArtistID) VALUES
('Folklore', '2020-07-24', 1),
('Map of the Soul: 7', '2020-02-21', 2),
('Dawn FM', '2022-01-07', 3),
('Un Verano Sin Ti', '2022-05-06', 4),
('Happier Than Ever', '2021-07-30', 5),
('After Hours', '2020-03-20', 3),
('Reputation', '2024-05-19', 1);

-- Songs
INSERT INTO SONG (Title, Duration, ReleaseDate, AlbumID, LanguageID) VALUES
('Cardigan', 230, '2020-07-24', 1, 1),
('Dynamite', 199, '2020-08-21', NULL, 2),
('Blinding Lights', 200, '2019-11-29', 3, 1),
('Tití Me Preguntó', 251, '2022-05-06', 4, 3),
('Bad Guy', 194, '2019-03-29', 5, 1),
('Butter', 164, '2021-05-21', NULL, 2),
('Save Your Tears', 215, '2020-03-20', 3, 1),
('Moscow Mule', 245, '2022-05-06', 4, 3),
('Happier Than Ever', 298, '2021-07-30', 5, 1),
('Anti-Hero', 201, '2022-10-21', NULL, 1),
('Yet To Come', 218, '2022-06-10', NULL, 2),
('Ojitos Lindos', 258, '2022-05-06', 4, 3),
('The Hills', 220, '2020-05-03', 6, 1),
('Ready For It?', 200, '2024-05-19', 7, 1),
('End Game', 200, '2024-05-19', 7, 1);

-- SongArtist
INSERT INTO SONGARTIST (SongID, ArtistID) VALUES
(1,1), (2,2), (3,3), (4,4), (5,5), (6,2), (7,3), (8,4), (9,5), (10,1), (11,2), (12,4), (13, 3), (14,1), (15, 1);

-- SongGenre
INSERT INTO SONGGENRE (SongID, GenreID) VALUES
(1,1), (2,2), (3,1), (4,4), (5,1), (6,2), (7,1), (8,4), (9,1), (10,1), (11,2), (12,4), (13, 1), (14,1), (15,1);

-- Users
INSERT INTO USER (Username, Email) VALUES
('swiftie2026', 'tayfan@example.com'),
('armyforever', 'btslover@example.com'),
('weekndvibes', 'abelmusic@example.com');

-- Playlists
INSERT INTO PLAYLIST (PlaylistName, DateCreated, UserID) VALUES
('My Chill Vibes', '2026-01-15', 1),
('K-Pop Bangers', '2026-02-01', 2),
('Late Night Drive', '2026-02-10', 3),
('Summer Latin', '2026-02-18', 1);

-- PlaylistSong
INSERT INTO PLAYLISTSONG (PlaylistID, SongID, Position) VALUES
(1, 1, 1), (1, 5, 2), (1, 9, 3), (1, 10, 4), (1, 12, 5),
(2, 2, 1), (2, 6, 2), (2, 11, 3),
(3, 3, 1), (3, 7, 2), (3, 1, 3),
(4, 4, 1), (4, 8, 2), (4, 12, 3);

-- ListeningHistory
INSERT INTO LISTENINGHISTORY (UserID, SongID, ListeningTimestamp) VALUES
(1, 1, '2026-02-20 14:30:00'), (1, 1, '2026-02-21 09:15:00'), (1, 5, '2026-02-22 19:40:00'),
(2, 2, '2026-02-19 22:10:00'), (2, 2, '2026-02-20 23:05:00'), (2, 6, '2026-02-21 18:20:00'),
(3, 3, '2026-02-18 01:45:00'), (3, 3, '2026-02-19 02:10:00'), (3, 7, '2026-02-20 00:30:00'),
(1,10, '2026-02-22 11:00:00'), (1, 9, '2026-02-23 13:25:00'),
(2,11, '2026-02-22 20:55:00'),
(3, 3, '2026-02-23 03:15:00'), (3, 7, '2026-02-23 04:00:00'), (3, 4, '2026-02-23 07:00:00'),
(1, 1, '2026-02-15 10:00:00'), (2, 2, '2026-02-16 21:30:00');

-- Ratings
INSERT INTO RATING (UserID, SongID, RatingValue) VALUES
(1, 1, 5), (1, 5, 4), (1, 10, 5), (1, 6, 3),
(2, 2, 5), (2, 6, 5), (2,11, 4),
(3, 3, 5), (3, 7, 4), (3, 14, 2), (3, 15, 1);

-- Likes
INSERT INTO USERLIKE (UserID, SongID) VALUES
(1, 1), (1, 5), (1, 9), (1,10), (1, 6),
(2, 2), (2, 6), (2,11),
(3, 3), (3, 7);

-- Charts
INSERT INTO CHART (ChartName, ChartDate) VALUES
('Billboard Hot 100', '2026-02-21'),
('Spotify Global Top 50', '2026-02-21');

-- ChartSong
INSERT INTO CHARTSONG (ChartID, SongID, RankNumber) VALUES
(1, 3, 1), (1, 10, 2), (1, 4, 3), (1, 7, 4),
(2, 2, 1), (2, 6, 2), (2,11, 3), (2,12, 4), (2, 3, 5);


-- 4. 7 Scenarios
-- Scenario 1: Browse Music by Genre (Pop songs with artists, ordered by song title)
-- Example uses 'Pop'
SELECT s.Title, GROUP_CONCAT(DISTINCT a.ArtistName SEPARATOR ', ') AS Artists,
       g.GenreName
FROM SONG s
JOIN SONGGENRE sg ON s.SongID = sg.SongID
JOIN GENRE g ON sg.GenreID = g.GenreID
JOIN SONGARTIST sa ON s.SongID = sa.SongID
JOIN ARTIST a ON sa.ArtistID = a.ArtistID
WHERE g.GenreName = 'Pop'
GROUP BY s.SongID, s.Title, g.GenreName
ORDER BY s.Title;

-- Scenario 2: Search for an Artist (albums and songs)
-- Example uses 'The Weeknd'
SELECT a.ArtistName, al.AlbumTitle, al.ReleaseDate, s.Title, s.Duration
FROM ARTIST a
LEFT JOIN ALBUM al ON a.ArtistID = al.ArtistID
LEFT JOIN SONG s ON al.AlbumID = s.AlbumID
WHERE a.ArtistName = 'The Weeknd'
ORDER BY al.ReleaseDate DESC, s.Title;

-- Scenario 3: Create a Playlist (simulates a view after insert; real UI would INSERT)
-- Example: Show songs in the 'My Chill Vibes' playlist
SELECT p.PlaylistName, s.Title, ps.Position
FROM PLAYLIST p
JOIN PLAYLISTSONG ps ON p.PlaylistID = ps.PlaylistID
JOIN SONG s ON ps.SongID = s.SongID
WHERE p.PlaylistName = 'My Chill Vibes'
ORDER BY ps.Position;

-- Scenario 4: Historical Song Data (listening history for a user)
-- Example: User 1 (swiftie2026)
SELECT u.Username, s.Title, lh.ListeningTimestamp
FROM LISTENINGHISTORY lh
JOIN USER u ON lh.UserID = u.UserID
JOIN SONG s ON lh.SongID = s.SongID
WHERE u.Username = 'swiftie2026'
ORDER BY lh.ListeningTimestamp DESC;

-- Scenario 5: Song Ratings (show ratings for a song)
-- Example: SongID 1 (Cardigan)
SELECT s.Title, u.Username, r.RatingValue
FROM RATING r
JOIN SONG s ON r.SongID = s.SongID
JOIN USER u ON r.UserID = u.UserID
WHERE s.SongID = 1
ORDER BY r.RatingValue DESC;

-- Scenario 6: Like a Song (show liked songs for a user)
-- Example: User 1
SELECT u.Username, s.Title
FROM USERLIKE ul
JOIN USER u ON ul.UserID = u.UserID
JOIN SONG s ON ul.SongID = s.SongID
WHERE u.Username = 'swiftie2026'
ORDER BY s.Title;

-- Scenario 7: View Top Charts (e.g., Billboard Hot 100)
SELECT c.ChartName, c.ChartDate, cs.RankNumber, s.Title, a.ArtistName
FROM CHART c
JOIN CHARTSONG cs ON c.ChartID = cs.ChartID
JOIN SONG s ON cs.SongID = s.SongID
JOIN SONGARTIST sa ON s.SongID = sa.SongID
JOIN ARTIST a ON sa.ArtistID = a.ArtistID
WHERE c.ChartName = 'Billboard Hot 100'
ORDER BY cs.RankNumber;


-- 5. The 5 Analytical Queries
-- Analytical 1: Most played songs in the last 30 days (as of Feb 26, 2026)
SELECT s.Title, COUNT(*) AS PlayCount
FROM LISTENINGHISTORY lh
JOIN SONG s ON lh.SongID = s.SongID
WHERE lh.ListeningTimestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY s.SongID, s.Title
ORDER BY PlayCount DESC
LIMIT 5;

-- Analytical 2: Most popular genres based on total listens
SELECT g.GenreName, COUNT(*) AS TotalListens
FROM LISTENINGHISTORY lh
JOIN SONG s ON lh.SongID = s.SongID
JOIN SONGGENRE sg ON s.SongID = sg.SongID
JOIN GENRE g ON sg.GenreID = g.GenreID
GROUP BY g.GenreName
ORDER BY TotalListens DESC;

-- Analytical 3: Top-rated songs by average user rating
SELECT s.Title, AVG(r.RatingValue) AS AvgRating, COUNT(r.RatingValue) AS NumRatings
FROM SONG s
LEFT JOIN RATING r ON s.SongID = r.SongID
GROUP BY s.SongID, s.Title
HAVING NumRatings > 0
ORDER BY AvgRating DESC, NumRatings DESC
LIMIT 5;

-- Analytical 4: Artists with the highest total number of song plays
SELECT a.ArtistName, COUNT(*) AS TotalPlays
FROM LISTENINGHISTORY lh
JOIN SONG s ON lh.SongID = s.SongID
JOIN SONGARTIST sa ON s.SongID = sa.SongID
JOIN ARTIST a ON sa.ArtistID = a.ArtistID
GROUP BY a.ArtistID, a.ArtistName
ORDER BY TotalPlays DESC
LIMIT 5;

-- Analytical 5: Listening trends by time of day (hour of day)
SELECT HOUR(lh.ListeningTimestamp) AS HourOfDay, COUNT(*) AS PlayCount
FROM LISTENINGHISTORY lh
GROUP BY HourOfDay
ORDER BY HourOfDay;

/*EXTRA SCENARIOS */

-- filter a users playlist by genre
SELECT user.Username, playlist.PlaylistName, song.Title, artist.ArtistName, genre.GenreName
FROM playlist
JOIN user ON playlist.UserID = user.UserID
JOIN playlistsong ON playlist.PlaylistID = playlistsong.PlaylistID
JOIN song ON playlistsong.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
JOIN songgenre ON song.SongID = songgenre.SongID
JOIN genre ON songgenre.GenreID = genre.GenreID
WHERE genre.GenreName = 'Latin Trap' -- other genre in playlist is 'Pop'
AND playlist.PlaylistName = 'My Chill Vibes'
AND user.Username = 'swiftie2026';

-- filter a users listening history by genre
SELECT user.Username, song.Title, artist.ArtistName, genre.GenreName, listeninghistory.listeningTimestamp
from listeninghistory
JOIN user ON user.UserID = listeninghistory.UserID
JOIN song ON listeninghistory.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
JOIN songgenre ON song.SongID = songgenre.SongID
JOIN genre ON songGenre.genreID = genre.GenreID
WHERE genre.GenreName = 'Pop' 
AND user.UserName = 'weekndvibes'
ORDER BY listeningHistory.HistoryID ASC;

-- filter charts by genre and chart name
SELECT chart.ChartName, chartsong.RankNumber, song.Title, artist.ArtistName, genre.GenreName
FROM chart
JOIN chartsong ON chart.ChartID = chartsong.ChartID
JOIN song ON chartsong.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
JOIN songgenre ON song.SongID = songgenre.SongID
JOIN genre ON songgenre.GenreID = genre.GenreID
WHERE genre.GenreName = 'Pop' 
AND  chart.ChartName = 'Billboard Hot 100'
ORDER BY chartsong.RankNumber ASC;

-- filter a users liked songs by genre
SELECT user.Username, Song.Title, artist.ArtistName, genre.GenreName
FROM userlike 
JOIN user ON userlike.UserID = user.UserID
JOIN song ON userlike.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
JOIN songgenre ON song.SongID = songgenre.SongID
JOIN genre ON songgenre.GenreID = genre.GenreID
WHERE genre.GenreName = 'K-Pop' -- other genres in liked songs is 'Pop'
AND user.Username = 'swiftie2026';

-- filter a users top 5 rated songs by genre
SELECT rating.RatingValue, song.Title, artist.ArtistName, genre.GenreName
FROM rating
JOIN user ON user.UserID = rating.UserID
JOIN song ON rating.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
JOIN songgenre ON song.SongID = songgenre.SongID
JOIN genre ON songgenre.GenreID = genre.GenreID
WHERE user.Username = 'swiftie2026'
AND genre.GenreName = 'K-Pop' -- other genres in rated songs is 'Pop'
ORDER BY rating.RatingValue DESC
LIMIT 5;

-- filter a users playlist by artist
SELECT user.Username, playlist.PlaylistName, song.Title, artist.ArtistName
FROM playlist
JOIN user ON playlist.UserID = user.UserID
JOIN playlistsong ON playlist.PlaylistID = playlistsong.PlaylistID
JOIN song ON playlistsong.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
WHERE artist.ArtistName = 'Taylor Swift' -- other artists in this playlist is 'Taylor Swift' and 'Billie Eilish'
AND playlist.PlaylistName = 'My Chill Vibes'
AND user.Username = 'swiftie2026';

-- filter a users listening history by artist
SELECT user.Username, song.Title, artist.ArtistName, listeninghistory.listeningTimestamp
from listeninghistory
JOIN user ON user.UserID = listeninghistory.UserID
JOIN song ON listeninghistory.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
WHERE artist.ArtistName = 'Bad Bunny' -- other artist in listening history is 'The Weeknd'
AND user.UserName = 'weekndvibes'
ORDER BY listeningHistory.listeningTimestamp DESC;

-- filter charts by artist and chart name
SELECT chart.ChartName, chartsong.RankNumber, song.Title, artist.ArtistName
FROM chart
JOIN chartsong ON chart.ChartID = chartsong.ChartID
JOIN song ON chartsong.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
WHERE artist.ArtistName = 'The Weeknd' -- other artist on chart is 'Taylor Swift'
AND  chart.ChartName = 'Billboard Hot 100'
ORDER BY chartsong.RankNumber ASC;

-- filter as users liked songs by artist
SELECT user.Username, Song.Title, artist.ArtistName
FROM userlike 
JOIN user ON userlike.UserID = user.UserID
JOIN song ON userlike.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
WHERE artist.ArtistName = 'Taylor Swift' -- other artist in liked songs is 'Billie Eilish'
AND user.Username = 'swiftie2026';

-- filter a users top 5 rated songs by artist
SELECT rating.RatingValue, song.Title, artist.ArtistName
FROM rating
JOIN user ON user.UserID = rating.UserID
JOIN song ON rating.SongID = song.SongID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
WHERE user.Username = 'swiftie2026'
AND artist.ArtistName = 'Billie Eilish' -- other artist in rated songs is 'Taylor Swift'
ORDER BY rating.RatingValue DESC
LIMIT 5;

-- search music by language
SELECT language.LanguageName, song.Title, artist.ArtistName
FROM language
JOIN song ON language.LanguageID = song.LanguageID
JOIN songartist ON song.SongID = songartist.SongID
JOIN artist ON songartist.ArtistID = artist.ArtistID
WHERE language.LanguageName = 'English';

/* EXTRA ANALYTICS */

-- list an artists albums by average user rating
SELECT artist.ArtistName, album.AlbumTitle, COUNT(rating.RatingValue) as NumOfRatings, AVG(rating.RatingValue) as AVGRating
FROM artist
JOIN songartist ON artist.ArtistID = songartist.ArtistID
JOIN song ON songartist.SongID = song.SongID
JOIN album ON song.albumID = album.albumID
JOIN rating ON song.SongID = rating.SongID
WHERE artist.ArtistName = 'Taylor Swift'
GROUP BY album.AlbumTitle
HAVING NumOfRatings > 0
ORDER BY AVGRating DESC, NumOfRatings DESC;

-- list all albums by average user rating (only lists albums that have rated songs)
SELECT artist.ArtistName, album.AlbumTitle, COUNT(rating.RatingValue) as NumOfRatings, AVG(rating.RatingValue) as AVGRating
FROM artist
JOIN songartist ON artist.ArtistID = songartist.ArtistID
JOIN song ON songartist.SongID = song.SongID
JOIN album ON song.albumID = album.albumID
JOIN rating ON song.SongID = rating.SongID
GROUP BY album.AlbumTitle, artist.ArtistName
Having NumOfRatings > 0
ORDER BY AVGRating DESC, NumOfRatings DESC
