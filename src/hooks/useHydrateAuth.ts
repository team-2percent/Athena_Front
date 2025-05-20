import { useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import useAuthStore from "@/stores/auth"

export function useHydrateAuth() {
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn)
  const setRole = useAuthStore((s) => s.setRole)
  const setUserId = useAuthStore((s) => s.setUserId)

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const userId = localStorage.getItem("userId")

    if (accessToken) {
      setLoggedIn(true)
      try {
        const { role } = jwtDecode<{ role: "ROLE_ADMIN" | "ROLE_USER" }>(accessToken)
        setRole(role)
      } catch {
        setRole("")
      }
    } else {
      setLoggedIn(false)
    }

    if (userId) {
      setUserId(Number(userId))
    }
  }, [setLoggedIn, setRole, setUserId])
}

export default useHydrateAuth
