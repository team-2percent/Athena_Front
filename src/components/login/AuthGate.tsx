"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth";
import { usePathname } from "next/navigation";

export function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);
  const { tokenCheck } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    tokenCheck().then(() => {
      if (
        role !== "ADMIN" && pathname.startsWith("/admin") ||
        !isLoggedIn && (pathname.startsWith("/my") || pathname.startsWith("/project/register") || pathname.endsWith("/edit"))
      ) {
        router.replace("/");
        return;
      }
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  return null;
}
