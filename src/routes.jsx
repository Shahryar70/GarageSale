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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
<Route path="/swaps" element={<MySwaps/>}/>
<Route path="/swaps/new" element={<ProposeSwap/>}/>
<Route path="/swaps/:id" element={<SwapDetails/>}/>
<Route path="/messages" element={<Inbox/>}>
<Route path=":id" element={<Conversation/>}/>
</Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
