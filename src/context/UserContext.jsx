import axios from "axios";
import { createContext, useState, useContext } from "react";

// Create the UserContext
const UserContext = createContext(null);

const apiUrl = import.meta.env.VITE_API_URL;

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  console.log(user);

  const fetchUser = async () => {
    console.log("Fetching user...");
    try {
      const response = await axios.post(
        `${apiUrl}/auth/relogin`,
        {},
        {
          withCredentials: true, // Ensure cookies are included
        }
      );

      if (response.status === 200) {
        console.log("User fetched successfully:", response.data);
        setUser(response.data.user); // Set user info if successful
        return response.data.user;
      }

      // Handle forbidden response
      if (response.status === 403) {
        throw new Error("Forbidden: User not authenticated");
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setUser(null); // Clear user if not authenticated
      throw error; // Propagate error to be handled in PrivateRoute
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
