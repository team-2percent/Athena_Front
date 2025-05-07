import { createStore } from "zustand";

interface AuthStore {
    isLoggedIn: boolean;
}

const useAuthStore = createStore<AuthStore>((set) => ({
    isLoggedIn: false,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
}))

export default useAuthStore;