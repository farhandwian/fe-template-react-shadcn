import { AuthContext } from "@/contexts/auth-context";
import { useAuthStore } from "@/store/auth-store";
import React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth } = useAuthStore();

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
}
