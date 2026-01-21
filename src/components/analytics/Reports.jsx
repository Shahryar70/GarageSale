// src/pages/analytics/Reports.jsx
import { useEffect, useState } from "react";
import { getReports } from "../../services/analytics.service";
import DataTable from "../../components/admin/DataTable";
import DateRangePicker from "../../components/analytics/DateRangePicker";
import ExportButton from "../../components/analytics/ExportButton";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({ from: "", to: "" });

  const load = () => {
    getReports(filter).then((res) => setReports(res.data || []));
  };

  useEffect(load, [filter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <DateRangePicker onChange={setFilter} />
        <ExportButton onClick={() => console.log("Exporting reports")} />
      </div>

      <DataTable
        columns={["Type", "User", "Message", "Date"]}
        data={reports}
      />
    </div>
  );
}
