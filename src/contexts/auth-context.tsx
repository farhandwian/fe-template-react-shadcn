import { Auth } from "@/store/auth-store";
import React from "react";

export interface AuthContext {
  auth: Auth | null;
}

export const AuthContext = React.createContext<AuthContext | null>(null);
