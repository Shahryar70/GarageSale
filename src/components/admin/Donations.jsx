// src/pages/admin/Donations.jsx
import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { getDonations } from "../../services/admin.service";

export default function Donations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    getDonations().then((res) => setDonations(res.data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Donations</h1>
      <DataTable columns={["Donor", "Amount", "Date"]} data={donations} />
    </div>
  );
}
