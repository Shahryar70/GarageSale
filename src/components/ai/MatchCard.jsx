// src/components/ai/MatchCard.jsx
import ScoreIndicator from "./ScoreIndicator";
import LocationBadge from "./LocationBadge";

export default function MatchCard({ match, onAction }) {
  return (
    <div className="border p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{match.item}</h3>
        <ScoreIndicator score={match.score} />
      </div>
      <LocationBadge location={match.location} />
      <p className="text-gray-500 text-sm">{match.description}</p>

      <div className="flex gap-2 mt-2">
        <button
          className="flex-1 bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => onAction("propose", match)}
        >
          Propose Swap
        </button>
        <button
          className="flex-1 bg-gray-200 text-gray-800 px-3 py-1 rounded"
          onClick={() => onAction("dismiss", match)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
