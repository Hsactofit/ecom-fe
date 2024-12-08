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
import { UserProvider } from "./context/UserContext";

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={darkMode ? "dark" : ""}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
