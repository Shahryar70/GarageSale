import api from "./api";

export const getMySwaps = () => api.get("/swaps");
export const getSwapById = (id) => api.get(`/swaps/${id}`);
export const proposeSwap = (data) => api.post("/swaps", data);
export const updateSwapStatus = (id, status) =>
  api.patch(`/swaps/${id}`, { status });