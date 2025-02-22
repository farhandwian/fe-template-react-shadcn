import { api } from "@/lib/api";
import {
  ActivateAccountInitiateRequestSchema,
  ActivateAccountInitiateResponseSchema,
  AssignUserAccessRequestSchema,
  AssignUserAccessResponseSchema,
  GetMeRequestSchema,
  GetMeResponseSchema,
  GetUserAccessListRequestSchema,
  GetUserAccessListResponseSchema,
  GetUserListRequestSchema,
  GetUserListResponseSchema,
  GetUserRequestSchema,
  GetUserResponseSchema,
  InitiatePasswordResetRequestSchema,
  InitiatePasswordResetResponseSchema,
  RegisterUserRequestSchema,
  RegisterUserResponseSchema,
} from "@/lib/schema";
import { z } from "zod";

const getMe = api<
  z.infer<typeof GetMeRequestSchema>,
  z.infer<typeof GetMeResponseSchema>
>({
  method: "GET",
  path: "/users/me",
  requestSchema: GetMeRequestSchema,
  responseSchema: GetMeResponseSchema,
});

const getUserList = api<
  z.infer<typeof GetUserListRequestSchema>,
  z.infer<typeof GetUserListResponseSchema>
>({
  method: "GET",
  path: "/users",
  requestSchema: GetUserListRequestSchema,
  responseSchema: GetUserListResponseSchema,
});

const getUser = api<
  z.infer<typeof GetUserRequestSchema>,
  z.infer<typeof GetUserResponseSchema>
>({
  method: "GET",
  path: "/api/users/:id",
  requestSchema: GetUserRequestSchema,
  responseSchema: GetUserResponseSchema,
});

const getUserAccessList = api<
  z.infer<typeof GetUserAccessListRequestSchema>,
  z.infer<typeof GetUserAccessListResponseSchema>
>({
  method: "GET",
  path: "/users/:id/access",
  requestSchema: GetUserAccessListRequestSchema,
  responseSchema: GetUserAccessListResponseSchema,
});

const assignUserAccess = api<
  z.infer<typeof AssignUserAccessRequestSchema>,
  z.infer<typeof AssignUserAccessResponseSchema>
>({
  method: "POST",
  path: "/users/:id/access",
  requestSchema: AssignUserAccessRequestSchema,
  responseSchema: AssignUserAccessResponseSchema,
});

const initiatePasswordReset = api<
  z.infer<typeof InitiatePasswordResetRequestSchema>,
  z.infer<typeof InitiatePasswordResetResponseSchema>
>({
  method: "POST",
  path: "/password/reset/initiate",
  requestSchema: InitiatePasswordResetRequestSchema,
  responseSchema: InitiatePasswordResetResponseSchema,
});

const activateAccountInitiate = api<
  z.infer<typeof ActivateAccountInitiateRequestSchema>,
  z.infer<typeof ActivateAccountInitiateResponseSchema>
>({
  method: "POST",
  path: "/account/activate/initiate",
  requestSchema: ActivateAccountInitiateRequestSchema,
  responseSchema: ActivateAccountInitiateResponseSchema,
});

const registerUser = api<
  z.infer<typeof RegisterUserRequestSchema>,
  z.infer<typeof RegisterUserResponseSchema>
>({
  method: "POST",
  path: "/account/register",
  requestSchema: RegisterUserRequestSchema,
  responseSchema: RegisterUserResponseSchema,
});

export const UserService = {
  getMe,
  getUserList,
  getUser,
  getUserAccessList,
  assignUserAccess,
  initiatePasswordReset,
  activateAccountInitiate,
  registerUser,
};
