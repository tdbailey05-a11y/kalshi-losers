const BASE = "/api";

export async function fetchTrades() {
  const res = await fetch(`${BASE}/trades`);
  if (!res.ok) throw new Error(`Failed to fetch trades: ${res.status}`);
  const data = await res.json();
  return data.trades ?? [];
}

export async function refreshTrades() {
  const res = await fetch(`${BASE}/refresh`, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to refresh: ${res.status}`);
  const data = await res.json();
  return data.trades ?? [];
}
