import axiosClient from "../axiosClient";

export const loginRequest = (email, password) =>
  axiosClient.post("/auth/login", { email, password });

export const logoutRequest = () => axiosClient.post("/auth/logout");

export const refreshRequest = () => axiosClient.post("/auth/refresh-token");

export const promoteToAdmin = (employeeId) =>
  axiosClient.post(`/auth/promote/${employeeId}`);

export const getMe = () => axiosClient.get("/auth/me");

export const changePasswordRequest = (currentPassword, newPassword) =>
  axiosClient.post("/auth/change-password", { currentPassword, newPassword });