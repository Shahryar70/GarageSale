// src/pages/admin/Swaps.jsx
import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { getSwaps } from "../../services/admin.service";

export default function Swaps() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    getSwaps().then((res) => setSwaps(res.data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Swaps</h1>
      <DataTable columns={["MyItem", "TargetItem", "Status", "EcoScore"]} data={swaps} />
    </div>
  );
}
