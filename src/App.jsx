import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { UserProvider, useUser } from "./context/UserContext";

const apiUrl = import.meta.env.VITE_API_URL;
const sellerUrl = import.meta.env.VITE_SELLER_PAGE_URL;
const customerUrl = import.meta.env.VITE_CUSTOMER_PAGE_URL;

function AppRoutes() {
  const { user, fetchUser } = useUser();

  console.log(user);

  useEffect(() => {
    const handleInitialRedirect = async () => {
      try {
        if (!user) {
          const fetchedUser = await fetchUser();
          if (fetchedUser) {
            if (fetchedUser.role === "seller") {
              window.location.href = sellerUrl;
            } else if (fetchedUser.role === "customer") {
              window.location.href = customerUrl;
            } else {
              toast.error("Invalid user role");
              window.location.href = "/login";
            }
          }
        } else {
          if (user.role === "seller") {
            window.location.href = sellerUrl;
          } else if (user.role === "customer") {
            window.location.href = customerUrl;
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        window.location.href = "/login";
      }
    };

    // Only run on mount
    if (window.location.pathname === "/") {
      handleInitialRedirect();
    }
  }, [user, fetchUser]);

  const PublicRoute = ({ children }) => {
    useEffect(() => {
      if (user) {
        if (user.role === "seller") {
          window.location.href = sellerUrl;
        } else if (user.role === "customer") {
          window.location.href = customerUrl;
        }
      }
    }, []);

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<div>Loading...</div>} />
      </Routes>
    </Router>
  );
}

function App() {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={darkMode ? "dark" : ""}>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
