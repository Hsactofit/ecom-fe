import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { jwtDecode } from "jwt-decode";

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
  role: null, // Updated to use "role" instead of "userType"
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
  "auth/register",
  async ({ userData, role }, thunkAPI) => {
    try {
      return await authService.register(userData, role);
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
  async ({ userData, role }, thunkAPI) => {
    try {
      return await authService.login(userData, role);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
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
        state.role = action.payload.role; // Updated to set "role"
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
        state.role = action.payload.role; // Updated to set "role"
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
