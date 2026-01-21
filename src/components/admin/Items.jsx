// src/pages/admin/Items.jsx
import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { getItems, deleteItem } from "../../services/admin.service";

export default function Items() {
  const [items, setItems] = useState([]);

  const load = () => {
    getItems().then((res) => setItems(res.data || []));
  };

  useEffect(load, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Items</h1>
      <DataTable
        columns={["Name", "Category", "Owner"]}
        data={items}
        actions={(item) => (
          <button
            onClick={async () => { await deleteItem(item.id); load(); }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        )}
      />
    </div>
  );
}
