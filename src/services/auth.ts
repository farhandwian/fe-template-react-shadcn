import { api } from "@/lib/api";

import {
  ChangePasswordRequestSchema,
  ChangePasswordResponseSchema,
  InitiateChangePasswordRequestSchema,
  InitiateChangePinRequestSchema,
  InitiateChangePinResponseSchema,
  LoginOTPRequestSchema,
  LoginOTPResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutRequestSchema,
  LogoutResponseSchema,
  RefreshTokenRequestSchema,
  RefreshTokenResponseSchema,
  VerifyChangePinRequestSchema,
  VerifyChangePinResponseSchema,
} from "@/lib/schema";
import { z } from "zod";

const login = api<
  z.infer<typeof LoginRequestSchema>,
  z.infer<typeof LoginResponseSchema>
>({
  method: "POST",
  path: "/auth/login",
  requestSchema: LoginRequestSchema,
  responseSchema: LoginResponseSchema,
  type: "public",
});

const loginOTP = api<
  z.infer<typeof LoginOTPRequestSchema>,
  z.infer<typeof LoginOTPResponseSchema>
>({
  method: "POST",
  path: "/auth/login/otp",
  requestSchema: LoginOTPRequestSchema,
  responseSchema: LoginOTPResponseSchema,
  type: "public",
});

const refreshToken = api<
  z.infer<typeof RefreshTokenRequestSchema>,
  z.infer<typeof RefreshTokenResponseSchema>
>({
  method: "POST",
  path: "/auth/refresh-token",
  requestSchema: RefreshTokenRequestSchema,
  responseSchema: RefreshTokenResponseSchema,
  type: "public",
});

const logout = api<
  z.infer<typeof LogoutRequestSchema>,
  z.infer<typeof LogoutResponseSchema>
>({
  method: "POST",
  path: "/auth/logout",
  requestSchema: LogoutRequestSchema,
  responseSchema: LogoutResponseSchema,
});

const initiateChangePassword = api<
  z.infer<typeof InitiateChangePasswordRequestSchema>,
  z.infer<typeof InitiateChangePasswordRequestSchema>
>({
  method: "POST",
  path: "/password/change/initiate",
  requestSchema: InitiateChangePasswordRequestSchema,
  responseSchema: InitiateChangePasswordRequestSchema,
});

const changePassword = api<
  z.infer<typeof ChangePasswordRequestSchema>,
  z.infer<typeof ChangePasswordResponseSchema>
>({
  method: "POST",
  path: "/password/change/verify",
  requestSchema: ChangePasswordRequestSchema,
  responseSchema: ChangePasswordResponseSchema,
});

const initiateChangePin = api<
  z.infer<typeof InitiateChangePinRequestSchema>,
  z.infer<typeof InitiateChangePinResponseSchema>
>({
  method: "POST",
  path: "/pin/change/initiate",
  requestSchema: InitiateChangePinRequestSchema,
  responseSchema: InitiateChangePinResponseSchema,
});

const verifyChangePin = api<
  z.infer<typeof VerifyChangePinRequestSchema>,
  z.infer<typeof VerifyChangePinResponseSchema>
>({
  method: "POST",
  path: "/pin/change/verify",
  requestSchema: VerifyChangePinRequestSchema,
  responseSchema: VerifyChangePinResponseSchema,
});

export const AuthService = {
  login,
  loginOTP,
  refreshToken,
  logout,
  initiateChangePassword,
  changePassword,
  initiateChangePin,
  verifyChangePin,
};
