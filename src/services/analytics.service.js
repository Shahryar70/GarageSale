// src/services/analytics.service.js
import api from "./api";

export const getUserAnalytics = (params) => api.get("/analytics/users", { params });
export const getSystemAnalytics = (params) => api.get("/analytics/system", { params });
export const getReports = (params) => api.get("/analytics/reports", { params });
