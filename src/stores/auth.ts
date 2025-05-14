import { create } from "zustand";

interface AuthStore {
    isLoggedIn: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    login: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ isLoggedIn: true });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); 
        set({ isLoggedIn: false });
    },
}))

export default useAuthStore;