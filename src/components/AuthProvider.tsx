"use client";

import { useHydrateAuth } from "@/hooks/useHydrateAuth";

export default function AuthProvider() {
  useHydrateAuth();
  return null;
}