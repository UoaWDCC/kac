import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL || "";

const api = axios.create({
  baseURL: `${baseUrl}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      console.error("Error data:", err.response?.data);

      return Promise.reject(
        err.response?.data?.message || err.message || "API request failed"
      );
    }

    return Promise.reject("API request failed");
  }
);

export default api;
