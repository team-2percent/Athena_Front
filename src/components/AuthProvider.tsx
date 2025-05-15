"use client";

import { useHydrateAuth } from "@/hooks/useHydrateAuth";
import useAuthStore from "@/stores/auth";
import Spinner from "./common/Spinner";
import { useState, useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  return <>{children}</>;
}