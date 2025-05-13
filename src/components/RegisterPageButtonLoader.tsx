"use client"

import { usePathname } from "next/navigation";
import RegisterPageButton from "../components/projectRegister/RegisterPageButton";
export default function RegisterPageButtonLoader() {
    const pathname = usePathname();
    console.log(pathname)
    if (pathname?.startsWith("/admin") || pathname === "/project/register" || pathname?.endsWith("/edit")) {
        return null;
    }
    return (
        <RegisterPageButton />
    )
}