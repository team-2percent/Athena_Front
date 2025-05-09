"use client"
import { usePathname } from "next/navigation";
import AdminHeader from "./admin/Header";
import Header from "./header/Header";

export default function HeaderLoader() {
    const pathname = usePathname().split("/")[1];
    if (pathname === "admin") {
        return <AdminHeader />
    }
    return <Header />
}