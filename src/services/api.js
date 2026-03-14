import axios from "axios";

export const apiPublic = axios.create({
  baseURL: "http://localhost:8080",
});
export const apiPrivate = axios.create({
  baseURL: "http://localhost:8080",
});

apiPrivate.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
