import axios from "axios";

export const apiPublic = axios.create({
  baseURL: import.meta.env.api_url,
});
export const apiPrivate = axios.create({
  baseURL: import.meta.env.api_url,
});

apiPrivate.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
