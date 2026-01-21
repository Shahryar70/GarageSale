// src/components/analytics/DateRangePicker.jsx
import { useState } from "react";

export default function DateRangePicker({ onChange }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const apply = () => {
    onChange({ from, to });
  };

  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <span>-</span>
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <button
        onClick={apply}
        className="bg-green-600 text-white px-4 py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
}
