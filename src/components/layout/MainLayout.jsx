import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";


export default function MainLayout() {
return (
 <div className="flex min-h-screen">
  <Sidebar />
  <div className="flex flex-col flex-1">
  <Navbar />
  <main className="flex-1 p-4">
  <Outlet />
  </main>
  <Footer />
 </div>
 </div>
);
}