// src/components/ai/ScoreIndicator.jsx
export default function ScoreIndicator({ score }) {
  const color =
    score >= 80 ? "bg-green-600" :
    score >= 50 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 text-white rounded-full text-xs ${color}`}>
        {score}%
      </span>
      <span className="text-gray-500 text-xs">Match Score</span>
    </div>
  );
}
