// src/pages/ProposeSwap.jsx
import { useState } from "react";
import { proposeSwap } from "../services/swap.service";
import { useNavigate } from "react-router-dom";

export default function ProposeSwap() {
  const [myItem, setMyItem] = useState("");
  const [targetItem, setTargetItem] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await proposeSwap({ myItem, targetItem });
    navigate("/swaps");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Propose Swap</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Your item"
          value={myItem}
          onChange={(e) => setMyItem(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Target item"
          value={targetItem}
          onChange={(e) => setTargetItem(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Submit Swap
        </button>
      </form>
    </div>
  );
}
