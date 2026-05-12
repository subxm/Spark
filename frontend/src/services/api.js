import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);
export const generateCode = (prompt) => API.post("/api/generate", { prompt });
export const getHistory = () => API.get("/api/history");
export const deleteHistory = (id) => API.delete(`/api/history/${id}`);
export const toggleFavourite = (id) =>
  API.patch(`/api/history/${id}/favourite`);

// Profile & stats
export const getProfileStats = () => API.get("/api/history/stats");
export const getAllGenerations = () => API.get("/api/history");

// Projects (uses same history data, grouped conceptually)
export const getProjects = () => API.get("/api/history");
export const renameProject = (id, title) =>
  API.patch(`/api/history/${id}`, { title });
export const duplicateProject = (id) => API.post(`/api/history/${id}/duplicate`);
