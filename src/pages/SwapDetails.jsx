// src/pages/SwapDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSwapById, updateSwapStatus } from "../services/swap.service";
import SwapStatusBadge from "../components/swap/SwapStatusBadge";

export default function SwapDetails() {
  const { id } = useParams();
  const [swap, setSwap] = useState(null);

  const load = () => {
    getSwapById(id).then((res) => setSwap(res.data));
  };

  useEffect(load, [id]);

  if (!swap) return null;

  const complete = async () => {
    await updateSwapStatus(id, "completed");
    load();
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-xl">
      <h2 className="text-lg font-semibold mb-2">
        {swap.myItem} ↔ {swap.targetItem}
      </h2>

      <SwapStatusBadge status={swap.status} />

      <p className="mt-3">EcoScore: 🌱 {swap.ecoScore}</p>

      {swap.status === "accepted" && (
        <button
          onClick={complete}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
}
