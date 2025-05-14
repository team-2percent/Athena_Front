"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminGuard() {
  const router = useRouter();
  const isAdmin = useAdmin();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/");
      return;
    }

    setChecked(true);
  }, [isAdmin]);

  if (!checked) return null;

  return null;
}
