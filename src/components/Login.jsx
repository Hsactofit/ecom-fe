import {
  Envelope,
  Eye,
  EyeSlash,
  Lock,
  SignIn,
  Storefront,
  User,
} from "@phosphor-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../store/features/authSlice";
import { toggleTheme } from "../store/features/themeSlice";
import Header from "./Header";
import axios from "axios";
import { useUser } from "../context/UserContext";

// const API_URL = "http://localhost:3001/api/v1/auth";
const apiUrl = import.meta.env.VITE_API_URL;
const sellerUrl = import.meta.env.VITE_SELLER_PAGE_URL;
const customerUrl = import.meta.env.VITE_CUSTOMER_PAGE_URL;

function Login() {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, user } = useUser();

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const userTypes = [
    { id: "customer", label: "Customer", icon: User },
    { id: "seller", label: "Seller", icon: Storefront },
  ];

  const handleGoogleSignIn = () => {
    // Implement Google Sign In logic here
    console.log("Google Sign In clicked");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) {
      toast.error("Please select a user type");
      return;
    }

    try {
      // Make API call to login endpoint
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Set the token in an HTTP-only cookie
      if (response.data.token) {
        document.cookie = `technology-heaven-token=${response.data.token}; path=/`;
      }

      setUser(response?.data?.user);

      toast.success("Logged in successfully!");

      console.log(response?.data?.user);

      // Redirect based on user type
      if (
        selectedType === "seller" &&
        response?.data?.user?.role === "seller"
      ) {
        window.location.href = `${sellerUrl}`;
      } else {
        window.location.href = `${customerUrl}`;
      }
    } catch (error) {
      // Handle login error
      const message =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-[var(--bg-color)]">
        <Header
          darkMode={darkMode}
          toggleTheme={() => dispatch(toggleTheme())}
        />

        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[var(--text-color)]">
                Welcome Back
              </h2>
              <p className="mt-2 text-[var(--text-color)]">
                Sign in to your account
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg-color)] text-[var(--text-color)]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`py-3 px-4 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                      selectedType === type.id
                        ? "bg-[var(--button-bg-color)] text-[var(--button-text-color)]"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      weight={selectedType === type.id ? "fill" : "regular"}
                      size={24}
                    />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--text-color)]"
                  >
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Envelope
                        className="h-5 w-5 text-gray-400"
                        weight="duotone"
                      />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[var(--text-color)]"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock
                        className="h-5 w-5 text-gray-400"
                        weight="duotone"
                      />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      placeholder="Enter your password"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlash size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedType}
                className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  isLoading || !selectedType
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-bg-color)]"
                } text-[var(--button-text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
              >
                <SignIn weight="bold" size={20} />
                <span>{isLoading ? "Signing in..." : "Sign in"}</span>
              </button>

              <div className="text-center">
                <p className="text-sm text-[var(--text-color)]">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-[var(--link-color)] hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
