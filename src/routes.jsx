// src/routes.jsx
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MySwaps from "./pages/MySwaps";
import ProposeSwap from "./pages/ProposeSwap";
import SwapDetails from "./pages/SwapDetails";
import Inbox from "./pages/Inbox";
import Conversation from "./pages/Conversation";
import AdminDashboard from "./components/admin/AdminDashboard";
import Users from "./components/admin/Users";
import Items from "./components/admin/Items";
import Donations from "./components/admin/Donations";
import Swaps from "./components/admin/Swaps";
import Reports from "./components/admin/Reports";
import ReceiverSuggestions from "./components/ai/ReceiverSuggestions";
import SwapSuggestions from "./components/ai/SwapSuggestions";
import PersonalizedFeed from "./components/ai/PersonalizedFeed";
import UserAnalytics from "./components/analytics/UserAnalytics";
import SystemAnalytics from "./components/analytics/SystemAnalytics";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import BrowseItems from "./pages/BrowseItems";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Messages from "./pages/Messages";
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
                  {/* Protected Routes */}
                 <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
  <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              <Route path="/edit-item/:id" element={<PrivateRoute>
                <EditItem/>
              </PrivateRoute>}/>
<Route path="/browse-items" element={<BrowseItems/>}/>
<Route path="/items/:id" element={<ItemDetails/>}/>
<Route 
  path="/add-item" 
  element={
    <PrivateRoute>
      <AddItem />
    </PrivateRoute>
  } 
/>
  <Route path="/messages" element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            } />
            <Route path="/conversation/:userId" element={
              <PrivateRoute>
                <Conversation />
              </PrivateRoute>
            } />

<Route path="/swaps" element={<MySwaps/>}/>
<Route path="/swaps/new" element={<ProposeSwap/>}/>
<Route path="/swaps/:id" element={<SwapDetails/>}/>

<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/users" element={<Users />} />
<Route path="/admin/items" element={<Items />} />
<Route path="/admin/donations" element={<Donations />} />
<Route path="/admin/swaps" element={<Swaps />} />
<Route path="/admin/reports" element={<Reports />} />
<Route path="/ai/receivers" element={<ReceiverSuggestions/>}/>
<Route path="/ai/swaps" element={<SwapSuggestions/>}/>
<Route path="/ai/feed" element={<PersonalizedFeed/>}/>
<Route path="/analytics/users" element={<UserAnalytics/>}/>
<Route path="/analytics/system" element={<SystemAnalytics/>}/>
<Route path="/analytics/reports" element={<Reports/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
