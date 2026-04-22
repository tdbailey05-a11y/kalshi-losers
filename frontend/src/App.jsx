import { useEffect, useState } from "react";
import { fetchTrades } from "./api.js";
import Leaderboard from "./Leaderboard.jsx";
import Countdown from "./Countdown.jsx";

const REFRESH_MS = 60_000;

export default function App() {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchTrades();
      setTrades(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1>Biggest Losers</h1>
        <Countdown intervalMs={REFRESH_MS} />
      </header>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!loading && !error && <Leaderboard trades={trades} />}
    </div>
  );
}
