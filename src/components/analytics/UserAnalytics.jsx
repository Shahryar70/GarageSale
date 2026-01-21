// src/pages/analytics/UserAnalytics.jsx
import { useEffect, useState } from "react";
import { getUserAnalytics } from "../../services/analytics.service";
import ChartCard from "../../components/analytics/ChartCard";
import DateRangePicker from "../../components/analytics/DateRangePicker";
import ExportButton from "../../components/analytics/ExportButton";

export default function UserAnalytics() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ from: "", to: "" });

  const load = () => {
    getUserAnalytics(filter).then((res) => setData(res.data || []));
  };

  useEffect(load, [filter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <DateRangePicker onChange={setFilter} />
        <ExportButton onClick={() => console.log("Exporting user analytics")} />
      </div>

      <ChartCard title="User Activity" data={data} />

      <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center text-gray-500">
        Heatmap placeholder
      </div>
    </div>
  );
}
