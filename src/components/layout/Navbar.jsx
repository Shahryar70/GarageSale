// src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <Link to="/" className="font-bold text-lg">Sustainify</Link>
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>
    </nav>
  );
}
