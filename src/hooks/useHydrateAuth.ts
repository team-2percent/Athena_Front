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
      try {
        const { role } = jwtDecode<{ role: "ADMIN" | "USER" }>(accessToken);
        setLoggedIn(true);
        setRole(role);
      } catch {
        setLoggedIn(false);
        setRole("");
      }
    }
  }, [setLoggedIn, setRole]);
}

export default useHydrateAuth;