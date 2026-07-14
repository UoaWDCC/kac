import axios from "axios";

if (import.meta.env.VITE_SERVER_URL === undefined) {
  axios.defaults.baseURL = "/api";
} else {
  axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}/api`;
}

const api = axios.create({
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
