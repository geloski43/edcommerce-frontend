import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import GlobalLoader from "./GlobalLoader";
import { useEffect } from "react";

export function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate({
        to: "/sign-up",
        search: { redirect_url: window.location.pathname },
      });
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Wait for Clerk
  if (!isLoaded) {
    return <GlobalLoader />;
  }

  // Not signed in → redirect is in progress
  if (!isSignedIn) {
    return null;
  }

  // Signed in → render protected routes
  return <Outlet />;
}
