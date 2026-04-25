import axios from "axios";
import { pool } from "../config/db.js";

// Fetch from iTunes API
export const fetchFromITunes = async (query) => {
  const res = await axios.get(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=10`
  );
  return res.data.results;
};

// Normalize iTunes data
export const normalizeITunes = (item) => ({
  title: item.collectionName || "Unknown",
  author: item.artistName || "Unknown",
  description: item.primaryGenreName || "",
  feedUrl: item.feedUrl || "",
  image: item.artworkUrl600 || "",
  totalEpisodes: item.trackCount || 0,
});

// Calculate frequency score
export const calculateFrequencyScore = (totalEpisodes) => {
  if (!totalEpisodes || totalEpisodes === 0) return 0;
  if (totalEpisodes >= 500) return 10;
  if (totalEpisodes >= 200) return 8;
  if (totalEpisodes >= 100) return 6;
  if (totalEpisodes >= 50) return 4;
  if (totalEpisodes >= 10) return 2;
  return 1;
};

// Save podcast to PostgreSQL
export const savePodcast = async (data) => {
  const { title, author, description, feedUrl, image, totalEpisodes, frequencyScore } = data;

  const result = await pool.query(
    `INSERT INTO podcasts 
      (title, author, description, feed_url, image, total_episodes, frequency_score, last_fetched)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (feed_url)
     DO UPDATE SET
       title = EXCLUDED.title,
       author = EXCLUDED.author,
       total_episodes = EXCLUDED.total_episodes,
       frequency_score = EXCLUDED.frequency_score,
       last_fetched = NOW()
     RETURNING *`,
    [title, author, description, feedUrl, image, totalEpisodes, frequencyScore]
  );

  return result.rows[0];
};

// Get all podcasts ranked by frequency score
export const getRankedPodcasts = async () => {
  const result = await pool.query(
    `SELECT * FROM podcasts ORDER BY frequency_score DESC`
  );
  return result.rows;
};