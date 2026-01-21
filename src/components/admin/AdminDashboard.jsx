// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard";
import ChartCard from "../../components/admin/ChartCard";
import { getStats } from "../../services/admin.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getStats().then((res) => {
      setStats(res.data.stats);
      setChartData(res.data.chart || []);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Users" value={stats.users || 0} icon="👤" />
        <StatsCard title="Items" value={stats.items || 0} icon="📦" />
        <StatsCard title="Donations" value={stats.donations || 0} icon="💰" />
        <StatsCard title="Swaps" value={stats.swaps || 0} icon="🔄" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Users Over Time" data={chartData} />
      </div>
    </div>
  );
}
