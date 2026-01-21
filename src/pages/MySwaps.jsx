// src/pages/MySwaps.jsx
import { useEffect, useState } from "react";
import { getMySwaps } from "../services/swap.service";
import SwapCard from "../components/swap/SwapCard";

export default function MySwaps() {
  const [swaps, setSwaps] = useState([]);

  const load = () => {
    getMySwaps().then((res) => setSwaps(res.data || []));
  };

  useEffect(load, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Swaps</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {swaps.map((s) => (
          <SwapCard key={s.id} swap={s} refresh={load} />
        ))}
      </div>
    </div>
  );
}
