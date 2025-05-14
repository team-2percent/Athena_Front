import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthStore {
    role: string;
    isLoggedIn: boolean;
    tokenCheck: () => Promise<void>;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    role: "",
    isLoggedIn: false,
    tokenCheck: async () => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
            const decoded = jwtDecode<{ role: string }>(accessToken);
            set({ isLoggedIn: true, role: decoded.role });
        } else {
            set({ isLoggedIn: false, role: "" });
        }
    },
    login: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        const decoded = jwtDecode<{ role: string }>(accessToken);
        set({ isLoggedIn: true, role: decoded.role });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); 
        set({ isLoggedIn: false, role: "" });
    },
}))

export default useAuthStore;