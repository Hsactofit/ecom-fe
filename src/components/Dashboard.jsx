import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/features/authSlice"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, userType } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("heaven-user");
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      {user && (
        <div>
          <p>Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>User Type: {userType}</p>
          <p>Token: {token}</p>
          <button onClick={handleLogout} className="p-3 bg-slate-3001">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
