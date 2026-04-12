import { createAuthClient } from "better-auth/react";
import { USER_ROLES } from "../constants";

export const authClient = createAuthClient({
  baseURL: "https://university-fullstack.vercel.app",
  user: {
    additionalFields: {
      role: {
        type: USER_ROLES,
        required: true,
        defaultValue: "student",
        input: true,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
