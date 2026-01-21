import api from "./api";

export const getStats = () => api.get("/admin/stats");
export const getUsers = () => api.get("/admin/users");
export const getItems = () => api.get("/admin/items");
export const getDonations = () => api.get("/admin/donations");
export const getSwaps = () => api.get("/admin/swaps");
export const getReports = () => api.get("/admin/reports");
export const toggleUserStatus = (id, active) =>
  api.patch(`/admin/users/${id}/status`, { active });
export const deleteItem = (id) => api.delete(`/admin/items/${id}`);