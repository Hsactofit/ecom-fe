//login.jsx
import {
  Envelope,
  Eye,
  EyeSlash,
  Lock,
  ShieldCheck,
  SignIn,
  Storefront,
  User,
} from "@phosphor-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/features/authSlice";
import { toggleTheme } from "../store/features/themeSlice";
import Header from "./Header";

function Login() {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const userTypes = [
    { id: "customer", label: "Customer", icon: User },
    { id: "seller", label: "Seller", icon: Storefront },
    { id: "admin", label: "Admin", icon: ShieldCheck },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) {
      toast.error("Please select a user type");
      return;
    }

    try {
      await dispatch(
        login({ userData: formData, role: selectedType })
      ).unwrap();
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-[var(--bg-color)]">
        {/* Header */}
        <Header
          darkMode={darkMode}
          toggleTheme={() => dispatch(toggleTheme())}
        />

        {/* Main Content */}
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

            {/* User Type Selection */}
            <div className="grid grid-cols-3 gap-3">
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
                {/* Email Input */}
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

                {/* Password Input */}
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
                className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
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
