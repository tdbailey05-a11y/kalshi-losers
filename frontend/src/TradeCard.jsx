import { formatDollar } from "./utils"  
export default function TradeCard({ rank, trade }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1rem",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
      }}
    >
      <div>
        <strong>#{rank}</strong> &middot; {trade.ticker}
        <div style={{ fontSize: "0.85rem", color: "#666" }}>
          {trade.taker_side.toUpperCase()} @ ${formatDollar(trade.entry_price)} &times; {trade.contracts}
        </div>
      </div>
      <div style={{ fontWeight: 600, color: "crimson" }}>-${formatDollar(trade.loss)}</div>
    </div>
  );
}
