import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { users } from "@/lib/strapiClient";
import { userActions } from "@/lib/user-store";

export function AuthSync() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk(); // Access Clerk's signOut method

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userId = user?.id;

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !userEmail || !userId) {
        userActions.clearUser();
        return;
      }

      try {
        const response = await users.find({
          filters: { email: { $eq: userEmail } },
          populate: ["purchased"],
        });

        const strapiUser = Array.isArray(response)
          ? response[0]
          : (response as any).data?.[0] || (response as any)[0];

        if (strapiUser) {
          // 1. Check if the user is blocked in Strapi
          if (strapiUser.blocked) {
            console.warn("User is blocked. Logging out...");

            // Clear local store
            userActions.clearUser();

            // 2. Tell Clerk to sign out AND where to go specifically
            // This prevents Clerk from defaulting to the home page "/"
            await signOut({ redirectUrl: "/blocked" });
            return;
          }

          const purchasedIds =
            strapiUser.purchased?.map((p: any) => p.productId) || [];

          userActions.setUser({
            email: userEmail,
            clerkId: userId,
            blocked: false, // We already checked for true above
            purchasedIds: purchasedIds,
          });
        } else {
          userActions.setUser({
            email: userEmail,
            clerkId: userId,
            blocked: false,
            purchasedIds: [],
          });
        }
      } catch (err) {
        console.error("Auth Sync Error:", err);
      }
    }

    syncUser();
  }, [userEmail, userId, isLoaded, signOut]);

  return null;
}
