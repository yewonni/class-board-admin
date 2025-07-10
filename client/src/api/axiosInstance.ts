import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoadingStore } from "@/store/useLoadingStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// zustand 상태를 밖에서 꺼냄
const setLoading = (loading: boolean) =>
  useLoadingStore.getState().setLoading(loading);
const getAccessToken = () => useAuthStore.getState().accessToken;
const setAccessToken = (token: string) =>
  useAuthStore.getState().setAccessToken(token);

const logout = () => useAuthStore.getState().logout();

// 인터셉터 후 헤더에 토큰 붙임 (로그인, 로그아웃, 리프레쉬 호출 시는 제외)
axiosInstance.interceptors.request.use(
  (config) => {
    setLoading(true);
    const token = getAccessToken();

    const noTokenPaths = ["/auth/login", "/auth/logout", "/auth/refresh"];

    if (config.url && noTokenPaths.some((path) => config.url?.includes(path))) {
      return config;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    setLoading(false);
    return Promise.reject(error);
  }
);

// 401 시 리프레쉬 호출
let isRefreshing = false;

type FailedQueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    setLoading(false);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const noRefreshPaths = ["/auth/login", "/auth/logout", "/auth/refresh"];
    const isNoRefresh =
      originalRequest.url &&
      noRefreshPaths.some((path) => originalRequest.url.includes(path));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isNoRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axiosInstance.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        setLoading(false);
      }
    }

    setLoading(false);
    return Promise.reject(error);
  }
);

export default axiosInstance;
