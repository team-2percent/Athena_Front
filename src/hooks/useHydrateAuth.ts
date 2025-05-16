import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/stores/auth";

export function useHydrateAuth() {
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  const setRole = useAuthStore((s) => s.setRole);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      setLoggedIn(true);
      try {
        const { role } = jwtDecode<{ role: "ROLE_ADMIN" | "ROLE_USER" }>(accessToken);
        setRole(role);
      } catch {
        setRole("");
      }
    } else {
      setLoggedIn(false);
    }
  }, [setLoggedIn, setRole]);
}

export default useHydrateAuth;