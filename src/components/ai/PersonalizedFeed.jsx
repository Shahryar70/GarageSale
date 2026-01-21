// src/pages/ai/PersonalizedFeed.jsx
import { useEffect, useState } from "react";
import { getPersonalizedFeed } from "../../services/ai.service";
import MatchCard from "../../components/ai/MatchCard";

export default function PersonalizedFeed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    getPersonalizedFeed().then((res) => setFeed(res.data || []));
  }, []);

  const handleAction = (action, match) => {
    if (action === "propose") console.log("Proposing feed swap:", match.id);
    else if (action === "dismiss") setFeed(feed.filter((m) => m.id !== match.id));
  };

  return (
    <div className="p-6 grid md:grid-cols-3 gap-4">
      {feed.map((m) => (
        <MatchCard key={m.id} match={m} onAction={handleAction} />
      ))}
    </div>
  );
}
