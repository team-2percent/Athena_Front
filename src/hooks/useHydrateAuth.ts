import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/stores/auth";

export function useHydrateAuth() {
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  const setRole = useAuthStore((s) => s.setRole);
  const setHydrated = useAuthStore((s) => s.setHydrated);

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
    setHydrated(true);
  }, [setLoggedIn, setRole, setHydrated]);
}

export default useHydrateAuth;