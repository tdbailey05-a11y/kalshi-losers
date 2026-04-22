import { useEffect, useState } from "react";

export default function Countdown({ intervalMs }) {
  const [remaining, setRemaining] = useState(intervalMs);

  useEffect(() => {
    setRemaining(intervalMs);
    const id = setInterval(() => {
      setRemaining((r) => (r <= 1000 ? intervalMs : r - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [intervalMs]);

  const seconds = Math.ceil(remaining / 1000);
  return <span style={{ color: "#666" }}>next refresh: {seconds}s</span>;
}
