//register.jsx
import {
  Envelope,
  Eye,
  EyeSlash,
  IdentificationCard,
  Lock,
  Phone,
  ShieldCheck,
  Storefront,
  User,
  UserCirclePlus,
} from "@phosphor-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../store/features/authSlice";
import { toggleTheme } from "../store/features/themeSlice";
import Header from "./Header";

function Register() {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        register({ userData: formData, role: selectedType })
      ).unwrap();
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Registration failed");
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
                Create Account
              </h2>
              <p className="mt-2 text-[var(--text-color)]">
                Join Technology Heaven today
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
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium text-[var(--text-color)]"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdentificationCard
                        className="h-5 w-5 text-gray-400"
                        weight="duotone"
                      />
                    </div>
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      required
                      className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      placeholder="Enter your full name"
                      onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                      }
                    />
                  </div>
                </div>

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
                    htmlFor="phone"
                    className="block text-sm font-medium text-[var(--text-color)]"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone
                        className="h-5 w-5 text-gray-400"
                        weight="duotone"
                      />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      placeholder="Enter your phone number"
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
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
                      placeholder="Create a password"
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[var(--text-color)]"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock
                        className="h-5 w-5 text-gray-400"
                        weight="duotone"
                      />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="pl-10 block w-full px-4 py-3 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg text-[var(--text-color)] focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      placeholder="Confirm your password"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
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
                <UserCirclePlus weight="bold" size={20} />
                <span>
                  {isLoading ? "Creating account..." : "Create account"}
                </span>
              </button>

              <div className="text-center">
                <p className="text-sm text-[var(--text-color)]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[var(--link-color)] hover:underline"
                  >
                    Sign in
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

export default Register;
