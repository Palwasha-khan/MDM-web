import axiosClient from "../axiosClient";

export const getDevices = (page = 1, limit = 20, search = "", compliance = "") =>
  axiosClient.get(
    `/device?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&compliance=${compliance}`
  );

export const getDeviceHistory = (id) => axiosClient.get(`/device/${id}/history`);

export const getPendingDevices = () => axiosClient.get("/device/pending");

export const approveDevice = (id) => axiosClient.patch(`/device/${id}/approve`);

export const rejectDevice = (id) => axiosClient.patch(`/device/${id}/reject`);

export const updateDevice = (id, updates) => axiosClient.put(`/device/${id}`, updates);

export const getDeviceStats = () => axiosClient.get("/device/stats");

export const sendCommand = (id, commandType) =>
  axiosClient.post(`/device/${id}/command`, { commandType });