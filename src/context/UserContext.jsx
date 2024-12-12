import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);
const apiUrl = import.meta.env.VITE_API_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    console.log("Fetching user...");
    try {
      const response = await axios.post(
        `${apiUrl}/auth/relogin`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.user) {
        console.log("User fetched successfully:", response.data.user);
        setUser(response.data.user);
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
