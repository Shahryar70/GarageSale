// src/pages/admin/Reports.jsx
import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { getReports } from "../../services/admin.service";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports().then((res) => setReports(res.data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Reports</h1>
      <DataTable columns={["Type", "User", "Message", "Date"]} data={reports} />
    </div>
  );
}
