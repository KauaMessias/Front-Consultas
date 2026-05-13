import axios from "axios";
import { toast } from "sonner";

async function refreshToken() {
  const response = await apiPublic.post("/api/v1/auth/refresh");
  return response.data?.token;
}

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

apiPrivate.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
        });
      }
      const token = await refreshPromise;
      sessionStorage.setItem("token", token);

      request.headers.Authorization = `Bearer ${token}`;
      return apiPrivate(request);
    } catch (e) {
      sessionStorage.clear();
      window.location.href = "/login";
      return Promise.reject(e);
    }
  },
);
