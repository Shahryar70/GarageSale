// src/components/swap/SwapActions.jsx
import { updateSwapStatus } from "../../services/swap.service";

export default function SwapActions({ swap, onAction }) {
  const handle = async (status) => {
    await updateSwapStatus(swap.id, status);
    onAction();
  };

  if (swap.status !== "pending") return null;

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => handle("accepted")}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Accept
      </button>
      <button
        onClick={() => handle("rejected")}
        className="px-3 py-1 bg-red-600 text-white rounded"
      >
        Reject
      </button>
    </div>
  );
}
