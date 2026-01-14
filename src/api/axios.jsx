import axios from "axios";

// Mettre ton backend Railway ici
const api = axios.create({
  baseURL: "https://web-production-6a3e3.up.railway.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access"); // ton JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
