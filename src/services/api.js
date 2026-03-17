import axios from "axios";

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiPrivate.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
