import useAuthStore from "@/stores/auth";

export const useAdmin = () => {
    const { role } = useAuthStore();
    return role === "ADMIN";
}