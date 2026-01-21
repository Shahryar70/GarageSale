// src/components/admin/UserStatusToggle.jsx
import { toggleUserStatus } from "../../services/admin.service";

export default function UserStatusToggle({ user, onUpdate }) {
  const handle = async () => {
    await toggleUserStatus(user.id, !user.active);
    onUpdate();
  };

  return (
    <button
      onClick={handle}
      className={`px-3 py-1 rounded ${
        user.active ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {user.active ? "Active" : "Inactive"}
    </button>
  );
}
