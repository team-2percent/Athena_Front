"use client"

import { usePathname } from "next/navigation";
import RegisterPageButton from "../components/projectRegister/RegisterPageButton";
import { useEffect, useState } from "react";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export default function RegisterPageButtonLoader() {
    const pathname = usePathname();
    const isDesktop = useIsDesktop();
    if (
      pathname?.startsWith("/admin") ||
      pathname === "/project/register" ||
      pathname?.endsWith("/edit") ||
      !isDesktop
    ) {
        return null;
    }
    return (
        <RegisterPageButton />
    )
}