import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("Backend url env not set!");
}

export const authClient = createAuthClient({
  baseURL: backendUrl,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        userRole: { type: "string" },
      },
    }),
  ],
});
