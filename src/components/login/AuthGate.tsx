"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useAuthStore from "@/stores/auth";

 // 페이지 접근성 설정
export function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, role } = useAuthStore();

  useEffect(() => {
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      router.replace("/");
    }

    if (!isLoggedIn && (pathname.startsWith("/my") || pathname.startsWith("/project/register") || pathname.endsWith("/edit"))) {
      console.log("redirecting to /")
      router.replace("/");
    }

  }, [pathname, role, router, isLoggedIn]);

  return null;
}
