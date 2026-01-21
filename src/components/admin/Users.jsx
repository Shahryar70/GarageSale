// src/pages/admin/Users.jsx
import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import UserStatusToggle from "../../components/admin/UserStatusToggle";
import { getUsers } from "../../services/admin.service";

export default function Users() {
  const [users, setUsers] = useState([]);

  const load = () => {
    getUsers().then((res) => setUsers(res.data || []));
  };

  useEffect(load, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <DataTable
        columns={["Name", "Email", "Role"]}
        data={users}
        actions={(user) => <UserStatusToggle user={user} onUpdate={load} />}
      />
    </div>
  );
}
