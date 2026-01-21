// src/components/layout/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-full p-4">
      <ul className="space-y-2">
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </aside>
  );
}
