import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";


export const router = createBrowserRouter([
{
element: <MainLayout />,
children: [
{ path: "/", element: <Home /> },
{
path: "/dashboard",
element: (
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
),
},
],
},
{ path: "/login", element: <Login /> },
{ path: "*", element: <NotFound /> },
]);