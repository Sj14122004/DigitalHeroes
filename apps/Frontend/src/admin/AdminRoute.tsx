import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include"
        });

        if (!response.ok) {
          setAuthorized(false);
          return;
        }

        const user = await response.json();
        setAuthorized(user.role === "ADMIN");
      } catch {
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] text-[#718078]">
        Loading...
      </div>
    );
  }

  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;