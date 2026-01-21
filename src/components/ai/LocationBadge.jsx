// src/components/ai/LocationBadge.jsx
export default function LocationBadge({ location }) {
  return (
    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
      {location}
    </span>
  );
}
