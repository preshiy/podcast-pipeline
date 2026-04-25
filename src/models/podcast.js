import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  title: String,
  description: String,
  publishedAt: Date,
  duration: Number,
  audioUrl: String,
});

const podcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  description: String,
  feedUrl: { type: String, unique: true },
  image: String,
  episodes: [episodeSchema],
  totalEpisodes: Number,
  frequencyScore: Number,
  consistencyRank: Number,
  lastFetched: { type: Date, default: Date.now },
});

export default mongoose.model("Podcast", podcastSchema);