"use client";

import { useHydrateAuth } from "@/hooks/useHydrateAuth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  return <>{children}</>;
}