import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/stores/auth";

export function useHydrateAuth() {
  const {setLoggedIn, setRole, setUserId} = useAuthStore();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (accessToken && userId) {
      setLoggedIn(true);
      try {
        const { role } = jwtDecode<{ role: "ROLE_ADMIN" | "ROLE_USER" }>(accessToken);
        setRole(role);
        setUserId(+userId);
      } catch {
        setRole("");
        setUserId(null);
      }
    } else {
      setLoggedIn(false);
    }
  }, [setLoggedIn, setRole]);
}

export default useHydrateAuth;