import { createAuthClient } from "better-auth/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("Backend url env not set!");
}

export const authClient = createAuthClient({
  baseURL: backendUrl,
  fetchOptions: {
    credentials: "include",
  },
});
