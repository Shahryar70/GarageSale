import api from "./api";
export const getReceiverSuggestions = () => api.get("/ai/receivers");
export const getSwapSuggestions = () => api.get("/ai/swaps");
export const getPersonalizedFeed  = () => api.get("ai/feed");