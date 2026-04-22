import TradeCard from "./TradeCard.jsx";

export default function Leaderboard({ trades }) {
  if (!trades.length) return <p>No trades yet.</p>;

  return (
    <ol style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
      {trades.map((trade, i) => (
        <li key={`${trade.ticker}-${i}`}>
          <TradeCard rank={i + 1} trade={trade} />
        </li>
      ))}
    </ol>
  );
}
