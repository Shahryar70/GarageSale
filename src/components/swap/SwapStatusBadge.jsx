const colors = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

export default function SwapStatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}