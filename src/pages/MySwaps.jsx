import { useEffect, useState } from "react";
import api from "../services/api";
import SwapCard from "../components/swap/SwapCard";


export default function MySwaps() {
const [swaps, setSwaps] = useState([]);
const [filter, setFilter] = useState("all");
const [loading, setLoading] = useState(true);


const fetchSwaps = async () => {
const { data } = await api.get("/swaps");
setSwaps(data);
setLoading(false);
};


useEffect(() => {
fetchSwaps();
}, []);


const filtered = filter === "all" ? swaps : swaps.filter(s => s.status === filter);


if (loading) return <div className="p-6">Loading swaps...</div>;


return (
<div className="p-6">
<h1 className="text-2xl font-bold mb-4">My Swaps</h1>


<div className="flex gap-2 mb-4 flex-wrap">
{["all","pending","accepted","rejected","completed"].map(s => (
<button
key={s}
onClick={() => setFilter(s)}
className={`px-3 py-1 rounded border ${filter===s?"bg-green-600 text-white":"bg-white"}`}
>
{s.toUpperCase()}
</button>
))}
</div>


<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
{filtered.map(swap => (
<SwapCard key={swap.id} swap={swap} onUpdate={fetchSwaps} />
))}
</div>
</div>
);
}