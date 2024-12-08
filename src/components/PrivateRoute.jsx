import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";

function PrivateRoute({ children }) {
  const { user, fetchUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          const fetchedUser = await fetchUser();
          setIsAuthenticated(!!fetchedUser); // Set to true if user is fetched
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication error:", error.message);
        setIsAuthenticated(false); // Explicitly set to false on error
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    checkAuth();
  }, [user, fetchUser]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
