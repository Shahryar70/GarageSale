import { useAuth } from "../../context/AuthContext";


export default function Navbar() {
const { logout, user } = useAuth();


return (
<div className="bg-gray-900 text-white p-4 flex justify-between">
<span>My App</span>
{user && <button onClick={logout}>Logout</button>}
</div>
);
}