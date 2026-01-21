// src/components/analytics/ExportButton.jsx
export default function ExportButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-1 rounded ml-auto"
    >
      Export
    </button>
  );
}
