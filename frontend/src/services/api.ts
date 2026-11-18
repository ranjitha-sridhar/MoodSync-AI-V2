import axios from "axios";

// Environment-aware API URL fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
    baseURL: API_URL
});

// Request interceptor: automatically append JWT Bearer token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("moodsync_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If token expired or invalid, clear and notify
            localStorage.removeItem("moodsync_token");
            localStorage.removeItem("moodsync_user");
            if (window.location.pathname !== "/login" && window.location.pathname !== "/signup" && window.location.pathname !== "/") {
                window.location.href = "/login?expired=true";
            }
        }
        return Promise.reject(error);
    }
);

export default API;
