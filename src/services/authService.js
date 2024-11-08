import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3001/api/v1/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper function to retrieve the token from cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  return cookies["technology-heaven-token"];
};

// Interceptor to include token in each request
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register user
const register = async (userData, role) => {
  console.log(userData, role);
  const response = await api.post(`register`, { ...userData, role });
  if (response.data && response.data.user) {
    // Store user data in local storage
    localStorage.setItem("heaven-user", JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
const login = async (userData, role) => {
  console.log(userData, role);
  const response = await api.post(`login`, { ...userData, role });
  if (response.data && response.data.user) {
    // Store user data in local storage
    localStorage.setItem("heaven-user", JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
const logout = () => {
  document.cookie =
    "technology-heaven-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
