import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


const login = async (credentials) => {
const { data } = await api.post("/auth/login", credentials);
localStorage.setItem("token", data.token);
setUser(data.user);
};


const logout = () => {
localStorage.removeItem("token");
setUser(null);
};


const loadUser = async () => {
try {
const { data } = await api.get("/auth/me");
setUser(data);
} catch {
setUser(null);
} finally {
setLoading(false);
}
};


useEffect(() => {
loadUser();
}, []);


return (
<AuthContext.Provider value={{ user, login, logout, loading, isAuth: !!user }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => useContext(AuthContext);