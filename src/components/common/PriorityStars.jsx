export default function PriorityStars({ level = 0, max = 10 }) {
  const filledStars = Math.min(level, max);
  const emptyStars = max - filledStars;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(filledStars)].map((_, i) => (
        <span key={`filled-${i}`} className="text-yellow-500">★</span>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      ))}
      <span className="text-xs text-gray-600 ml-1">({level}/10)</span>
    </div>
  );
}