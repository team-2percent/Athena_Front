"use client";

import { useHydrateAuth } from "@/hooks/useHydrateAuth";
import useAuthStore from "@/stores/auth";
import Spinner from "./common/Spinner";
import { useState, useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  const [mounted, setMounted] = useState(false);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted ||!hydrated) return (
    <div className="flex justify-center items-center h-screen">
      <Spinner message="loading..." />
    </div>
  );
  return <>{children}</>;
}