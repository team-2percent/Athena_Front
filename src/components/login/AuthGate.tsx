"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

 // 페이지 접근성 설정
export function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { checkAuth, role } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      router.replace("/");
    }

    if (!checkAuth() && (pathname.startsWith("/my") || pathname.startsWith("/project/register") || pathname.endsWith("/edit"))) {
      router.replace("/");
    }

    setChecked(true);
  }, [pathname, role, router]);

  if (!checked) return null;

  return null;
}
