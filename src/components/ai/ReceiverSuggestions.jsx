// src/pages/ai/ReceiverSuggestions.jsx
import { useEffect, useState } from "react";
import { getReceiverSuggestions } from "../../services/ai.service";
import MatchCard from "../../components/ai/MatchCard";

export default function ReceiverSuggestions() {
  const [matches, setMatches] = useState([]);

  const load = () => {
    getReceiverSuggestions().then((res) => setMatches(res.data || []));
  };

  useEffect(load, []);

  const handleAction = (action, match) => {
    if (action === "propose") console.log("Proposing swap to:", match.id);
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
