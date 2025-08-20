import axios from "axios";

// Vite env (fallback to localhost:5000)
// Create a single axios instance for the app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Auto-attach JWT from localStorage
// Auto-attach JWT from localStorage to every request
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});


// ---------- Endpoints ----------

// Phase-1: Resume ↔ JD align
export const align = (payload) => api.post("/api/resume/align", payload);

// Phase-1: History (paged)
export const getHistory = ({ page = 1, limit = 10 } = {}) =>
  api.get("/api/resume/history", { params: { page, limit } });

// (Optional) Auth helpers if you want them here too
export const login = (payload) => api.post("/api/auth/login", payload);
export const me = () => api.get("/api/auth/me");


export default api;
