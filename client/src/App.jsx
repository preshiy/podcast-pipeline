import { useState } from "react";
import axios from "axios";

export default function App() {
  const [query, setQuery] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("search");

  const searchPodcasts = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setPodcasts([]);

    try {
      const res = await axios.get(
        `http://localhost:5001/api/podcasts/search/${encodeURIComponent(query)}`
      );
      setPodcasts(res.data.data);
    } catch (err) {
      setError("Could not fetch podcasts. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getRanked = async () => {
    setLoading(true);
    setError(null);
    setPodcasts([]);

    try {
      const res = await axios.get(`http://localhost:5001/api/podcasts/ranked`);
      setPodcasts(res.data.data);
    } catch (err) {
      setError("Could not fetch ranked podcasts.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "#34d399";
    if (score >= 7) return "#f5c518";
    if (score >= 5) return "#fb923c";
    return "#f87171";
  };

  const getScoreBadge = (score) => {
    if (score >= 9) return { text: "🏆 Highly Consistent", color: "#34d399" };
    if (score >= 7) return { text: "👍 Consistent", color: "#f5c518" };
    if (score >= 5) return { text: "😐 Moderate", color: "#fb923c" };
    return { text: "👎 Infrequent", color: "#f87171" };
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎙️ Podcast Pipeline</h1>
        <p style={styles.subtitle}>
          Search podcasts · normalize metadata · rank by consistency
        </p>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === "search" ? styles.tabActive : {}) }}
          onClick={() => { setTab("search"); setPodcasts([]); }}
        >
          🔍 Search Podcasts
        </button>
        <button
          style={{ ...styles.tab, ...(tab === "ranked" ? styles.tabActive : {}) }}
          onClick={() => { setTab("ranked"); getRanked(); }}
        >
          🏆 Ranked Podcasts
        </button>
      </div>

      {/* SEARCH BOX */}
      {tab === "search" && (
        <div style={styles.searchBox}>
          <input
            style={styles.input}
            type="text"
            placeholder="Search podcasts e.g technology, business, health..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchPodcasts()}
          />
          <button style={styles.button} onClick={searchPodcasts}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p style={styles.loading}>🔍 Loading podcasts...</p>}

      {/* ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* RESULTS COUNT */}
      {podcasts.length > 0 && (
        <p style={styles.count}>
          Found <strong>{podcasts.length}</strong> podcasts
        </p>
      )}

      {/* PODCAST CARDS */}
      <div style={styles.grid}>
        {podcasts.map((podcast, i) => {
          const score = parseFloat(podcast.frequency_score) || 0;
          const badge = getScoreBadge(score);
          const barWidth = (score / 10) * 100;

          return (
            <div key={podcast.id} style={styles.card}>
              {/* RANK */}
              {tab === "ranked" && (
                <div style={styles.rank}>#{i + 1}</div>
              )}

              {/* IMAGE */}
              {podcast.image ? (
                <img src={podcast.image} alt={podcast.title} style={styles.image} />
              ) : (
                <div style={styles.noImage}>🎙️</div>
              )}

              {/* CARD BODY */}
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{podcast.title}</h3>
                <p style={styles.cardAuthor}>by {podcast.author}</p>
                <p style={styles.cardGenre}>{podcast.description}</p>

                {/* EPISODES */}
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>📻 Episodes</span>
                  <span style={styles.statValue}>{podcast.total_episodes?.toLocaleString()}</span>
                </div>

                {/* FREQUENCY SCORE BAR */}
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>📊 Frequency Score</span>
                  <span style={{ ...styles.statValue, color: getScoreColor(score) }}>
                    {score}/10
                  </span>
                </div>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.bar,
                    width: `${barWidth}%`,
                    background: getScoreColor(score)
                  }} />
                </div>

                {/* BADGE */}
                <div style={{
                  ...styles.badge,
                  color: badge.color,
                  borderColor: badge.color,
                  background: `${badge.color}22`
                }}>
                  {badge.text}
                </div>

                {/* LAST FETCHED */}
                <p style={styles.lastFetched}>
                  🕒 {new Date(podcast.last_fetched).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  app: {
    background: "#080810",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#f1f1f1",
    paddingBottom: "60px",
  },
  header: {
    textAlign: "center",
    padding: "60px 20px 30px",
    background: "linear-gradient(180deg, #1a0533 0%, #080810 100%)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #a855f7, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  subtitle: { color: "#888", fontSize: "1rem" },
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    padding: "20px",
  },
  tab: {
    padding: "10px 24px",
    borderRadius: "50px",
    border: "1px solid #2a2a2a",
    background: "#111118",
    color: "#777",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  tabActive: {
    background: "linear-gradient(135deg, #a855f7, #6366f1)",
    color: "#fff",
    border: "none",
  },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    padding: "10px 20px 20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "14px 22px",
    width: "400px",
    borderRadius: "50px",
    border: "1px solid #2a2a2a",
    fontSize: "1rem",
    background: "#111118",
    color: "#fff",
    outline: "none",
  },
  button: {
    padding: "14px 28px",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(135deg, #a855f7, #6366f1)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  loading: { textAlign: "center", color: "#a855f7", padding: "40px" },
  error: { textAlign: "center", color: "#f87171", padding: "20px" },
  count: {
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem",
    marginBottom: "20px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
    padding: "0 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "#111118",
    borderRadius: "16px",
    width: "260px",
    overflow: "hidden",
    border: "1px solid #1e1e2e",
    transition: "transform 0.3s, box-shadow 0.3s",
    position: "relative",
  },
  rank: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "linear-gradient(135deg, #a855f7, #6366f1)",
    color: "#fff",
    borderRadius: "50px",
    padding: "4px 12px",
    fontSize: "0.8rem",
    fontWeight: 700,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    display: "block",
  },
  noImage: {
    width: "100%",
    height: "260px",
    background: "#1a1a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
  },
  cardBody: { padding: "16px" },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardAuthor: { fontSize: "0.8rem", color: "#a855f7", marginBottom: "4px" },
  cardGenre: { fontSize: "0.75rem", color: "#555", marginBottom: "12px" },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  statLabel: { fontSize: "0.75rem", color: "#777" },
  statValue: { fontSize: "0.75rem", color: "#fff", fontWeight: 600 },
  barBg: {
    background: "#1e1e2e",
    borderRadius: "999px",
    height: "5px",
    marginBottom: "12px",
    overflow: "hidden",
  },
  bar: {
    height: "5px",
    borderRadius: "999px",
    transition: "width 1s ease",
  },
  badge: {
    display: "block",
    textAlign: "center",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 700,
    border: "1px solid",
    marginBottom: "8px",
  },
  lastFetched: {
    fontSize: "0.72rem",
    color: "#555",
    textAlign: "center",
  },
};