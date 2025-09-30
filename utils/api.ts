import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export default api;
