// src/pages/ai/SwapSuggestions.jsx
import { useEffect, useState } from "react";
import { getSwapSuggestions } from "../../services/ai.service";
import MatchCard from "../../components/ai/MatchCard";

export default function SwapSuggestions() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getSwapSuggestions().then((res) => setMatches(res.data || []));
  }, []);

  const handleAction = (action, match) => {
    if (action === "propose") console.log("Swap proposed for:", match.id);
    else if (action === "dismiss") setMatches(matches.filter((m) => m.id !== match.id));
  };

  return (
    <div className="p-6 grid md:grid-cols-3 gap-4">
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} onAction={handleAction} />
      ))}
    </div>
  );
}
