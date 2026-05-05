import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) {
      console.error("API error status:", err.response?.status);
      console.error("API error data:", err.response?.data);

      return Promise.reject(
        err.response?.data?.message || err.message || "API request failed"
      );
    }

    return Promise.reject("API request failed");
  }
);

export default api;
