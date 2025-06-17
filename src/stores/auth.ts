import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

export type UserRole = "ROLE_ADMIN" | "ROLE_USER" | ""

interface AuthStore {
  isLoggedIn: boolean;
  role: UserRole;
  userId: number | null;
  fcmToken: string | null;
  setLoggedIn: (loggedIn: boolean) => void;
  setRole: (role: string) => void;
  setUserId: (userId: number | null) => void;
  setFcmToken: (fcmToken: string | null) => void;
  login: (accessToken: string, userId: number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  role: "",
  userId: null,
  fcmToken: null,
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setRole: (role) => {
    if (role !== 'ROLE_ADMIN' && role !== 'ROLE_USER') { 
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
      }
      set({ isLoggedIn: false, role: "", userId: null });
      return;
    } else {
      set({ role })
    }
  },
  setUserId: (userId) => set({ userId }),
  setFcmToken: (fcmToken) => set({ fcmToken }),
  login: (accessToken, userId) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId.toString());
    }
    const { role } = jwtDecode<{ role: string }>(accessToken);
    const store = useAuthStore.getState();
    store.setLoggedIn(true);
    store.setRole(role);
    store.setUserId(userId);
    },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userId")
    }
    set({ isLoggedIn: false, role: "", userId: null, fcmToken: null })
  },
}))

export default useAuthStore
