import {
  fetchFromITunes,
  normalizeITunes,
  calculateFrequencyScore,
  savePodcast,
  getRankedPodcasts,
} from "../services/podcastService.js";

export const searchPodcasts = async (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const results = await fetchFromITunes(query);
    const saved = [];

    for (const item of results) {
      const normalized = normalizeITunes(item);
      if (!normalized.feedUrl) continue;

      normalized.frequencyScore = calculateFrequencyScore(normalized.totalEpisodes);
      const podcast = await savePodcast(normalized);
      saved.push(podcast);
    }

    return res.json({
      message: `Found and saved ${saved.length} podcasts`,
      data: saved,
    });

  } catch (err) {
    console.error("❌ Search error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRanked = async (req, res) => {
  try {
    const podcasts = await getRankedPodcasts();
    return res.json({ total: podcasts.length, data: podcasts });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};