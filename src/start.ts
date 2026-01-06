import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => {
  return {
    // 🛑 REMOVE: requestMiddleware: [clerkMiddleware()],
    // This array should be empty or contain only other client-safe middleware
    requestMiddleware: [],
    // ... other config
  };
});
