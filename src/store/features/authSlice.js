import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://ecom-be-t42v.onrender.com/api/v1/auth";

// Helper function to retrieve the token from cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  return cookies["technology-heaven-token"];
};

const initialState = {
  user: null,
  role: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const setUserFromToken = () => {
  const token = getTokenFromCookies();
  if (token) {
    const decoded = jwtDecode(token);
    return {
      user: { id: decoded.id, fullname: decoded.fullname, role: decoded.role },
    };
  }
  return null;
};

// Register user
export const register = createAsyncThunk(
    "auth/signup",
    async ({ userData, role }, thunkAPI) => {
      try {

        const requestData = {
          name: userData.fullname,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
        };

        if (role === "seller") {
          Object.assign(requestData, {
            role: "seller",
            storeName: userData.storeName,
            location: userData.location,
            bankDetails: userData.bankDetails,
            earnings: {
              total: 0,
              pending: 0,
            },
          });
        }

        const response = await axios.post(`${API_URL}/signup`, requestData);

        // Set cookie with token
        if (response.data.token) {
          document.cookie = `technology-heaven-token=${response.data.token}; path=/`;
        }

        return {
          user: response.data.user,
          // role: response.data.user.role,
        };
      } catch (error) {
        const message =
            error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
);

// Login user
export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });

        // Set cookie with token
        if (response.data.token) {
          document.cookie = `technology-heaven-token=${response.data.token}; path=/`;
        }

        return {
          user: response.data.user,
          role: response.data.user.role,
        };
      } catch (error) {
        const message =
            error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
);

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  // Remove the cookie
  document.cookie = "technology-heaven-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
});

const authSlice = createSlice({
  name: "auth",
  initialState: { ...initialState, ...setUserFromToken() },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(register.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload.user;
          state.role = action.payload.role;
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload.user;
          state.role = action.payload.role;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null;
          state.role = null;
        });
  },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;