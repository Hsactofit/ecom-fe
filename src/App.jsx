import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setUser } from "./store/features/authSlice";

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if "heaven-user" data exists in localStorage
    const storedUser = localStorage.getItem("heaven-user");
    if (storedUser) {
      try {
        // Decode and parse the stored user data
        const decodedUser = JSON.parse(storedUser);
        dispatch(setUser(decodedUser)); // Update the Redux state with the user data
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, [dispatch]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <div>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              success: { style: { background: "#22c55e", color: "white" } },
              error: { style: { background: "#ef4444", color: "white" } },
            }}
          />
        </div>
      </Router>
    </div>
  );
}

export default App;
