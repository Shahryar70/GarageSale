import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export default function ProposeSwap() {
const [myItems, setMyItems] = useState([]);
const [targetItems, setTargetItems] = useState([]);
const [myItemId, setMyItemId] = useState("");
const [targetItemId, setTargetItemId] = useState("");
const navigate = useNavigate();


useEffect(() => {
api.get("/items/mine").then(r => setMyItems(r.data));
api.get("/items").then(r => setTargetItems(r.data));
}, []);


const submit = async (e) => {
e.preventDefault();
await api.post("/swaps", { myItemId, targetItemId });
navigate("/swaps");
};


return (
<div className="max-w-xl mx-auto p-6">
<h1 className="text-xl font-bold mb-4">Propose Swap</h1>


<form onSubmit={submit} className="space-y-4">
<select required className="w-full border p-2 rounded" value={myItemId} onChange={e=>setMyItemId(e.target.value)}>
<option value="">Select your item</option>
{myItems.map(i=> <option key={i.id} value={i.id}>{i.name}</option>)}
</select>


<select required className="w-full border p-2 rounded" value={targetItemId} onChange={e=>setTargetItemId(e.target.value)}>
<option value="">Select target item</option>
{targetItems.map(i=> <option key={i.id} value={i.id}>{i.name}</option>)}
</select>


<button className="bg-green-600 text-white px-4 py-2 rounded w-full">Submit</button>
</form>
</div>
);
}