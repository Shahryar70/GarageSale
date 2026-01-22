// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { MessageProvider } from "./context/MessageContext";
import { NotificationProvider } from "./components/messages/NotificationContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MessageProvider>
          <NotificationProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
        </NotificationProvider>
        </MessageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
