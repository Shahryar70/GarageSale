// src/routes.jsx
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Conversation from "./pages/Conversation";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import BrowseItems from "./pages/BrowseItems";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Messages from "./pages/Messages";
import Verification from "./pages/Verification";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerificationsQueue from "./pages/admin/VerificationsQueue";
import UserManagement from "./pages/admin/UserManagement";
import HowItWorks from "./components/HowItWorks";
import MyDonations from "./pages/MyDonations";
import PhotoProofUpload from "./components/donations/PhotoProofUpload";
import PhotoProofVerification from "./components/donations/PhotoProofVerification";
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/how-it-works" element={<HowItWorks/>}/>
      <Route path="*" element={<NotFound />} />
      {/* Protected Routes */}
       <Route element={<PrivateRoute/>}>
       <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/edit-item/:id" element={<EditItem/>}/>
        <Route path="/browse-items" element={<BrowseItems/>}/>
        <Route path="/items/:id" element={<ItemDetails/>}/>
        <Route path="/add-item" element={<AddItem/>}/>
        <Route path="/messages" element={<Messages/>}/>
        <Route path="/conversation/:userId" element={<Conversation/>}/>
        <Route path="/verification" element={<Verification/>}/>
        <Route path="/my-donations" element={<MyDonations/>}/>
        <Route element={<AdminRoute/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
         <Route path="/admin/verifications" element={<VerificationsQueue/>}/>
         <Route path="/admin/users" element={<UserManagement/>}/>
<Route path="/donations/:donationId/upload-proof" element={<PhotoProofUpload />} />
<Route path="/donations/:donationId/verify-proof" element={<PhotoProofVerification />} />
         </Route>
         </Route>
    </Routes>
  );
}
