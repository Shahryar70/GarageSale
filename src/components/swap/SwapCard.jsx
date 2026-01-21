// src/components/swap/SwapCard.jsx
import { Link } from "react-router-dom";
import SwapStatusBadge from "./SwapStatusBadge";
import SwapActions from "./SwapActions";

export default function SwapCard({ swap, refresh }) {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {swap.myItem} ↔ {swap.targetItem}
        </h3>
        <SwapStatusBadge status={swap.status} />
      </div>

      <p className="text-sm text-gray-500 mt-1">
        EcoScore: 🌱 {swap.ecoScore}
      </p>

      <div className="flex justify-between items-center mt-3">
        <Link
          to={`/swaps/${swap.id}`}
          className="text-green-600 text-sm underline"
        >
          View Details
        </Link>
        <SwapActions swap={swap} onAction={refresh} />
      </div>
    </div>
  );
}
