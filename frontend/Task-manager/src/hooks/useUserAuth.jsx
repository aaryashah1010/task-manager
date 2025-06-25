import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      clearUser();
      navigate("/login");
    }

    // Only redirect if current page is not already correct
    if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
      navigate("/admin/dashboard");
    } else if (user?.role !== "admin" && !location.pathname.startsWith("/member")) {
      navigate("/member/dashboard");
    }

  }, [user, loading, clearUser, navigate, location]);
};
