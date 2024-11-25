// components/Header.js
import { Link } from "react-router-dom";
import {
  Moon,
  Sun,
  House,
  ShoppingCart,
  SignIn,
  UserCirclePlus,
} from "@phosphor-icons/react";

function Header({ darkMode, toggleTheme }) {
  return (
    <header className="w-full px-6 py-4 bg-[var(--header-bg-color)] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-[var(--text-color)]">
          Technology Heaven
        </h1>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            {/*<Link*/}
            {/*  to="/"*/}
            {/*  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"*/}
            {/*>*/}
            {/*  <House weight="bold" size={20} />*/}
            {/*  <span>Home</span>*/}
            {/*</Link>*/}
            <Link
              to="/shop"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ShoppingCart weight="bold" size={20} />
              <span>Shop</span>
            </Link>
            {/*<Link*/}
            {/*  to="/login"*/}
            {/*  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"*/}
            {/*>*/}
            {/*  <SignIn weight="bold" size={20} />*/}
            {/*  <span>Login</span>*/}
            {/*</Link>*/}
            {/*<Link*/}
            {/*  to="/register"*/}
            {/*  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"*/}
            {/*>*/}
            {/*  <UserCirclePlus weight="bold" size={20} />*/}
            {/*  <span>Register</span>*/}
            {/*</Link>*/}
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun weight="fill" size={24} />
            ) : (
              <Moon weight="fill" size={24} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
