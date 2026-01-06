import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { uiStore, uiActions } from "../../lib/ui-store.ts";
import { useStore } from "@tanstack/react-store";
import { LogIn } from "lucide-react";

export default function HeaderUser() {
  // Although sidebarOpen isn't directly used here, we keep the read from the store
  // to maintain consistency if future logic relies on it.
  const sidebarOpen = useStore(uiStore, (s) => s.sidebarOpen);

  return (
    <>
      <SignedIn>
        {/* Clerk's UserButton handles its own theming,
            so we leave this component alone. */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link
          // Default state: use text-foreground and hover/bg-accent for links
          className="flex items-center gap-3 p-3 rounded-lg text-foreground hover:bg-accent transition-colors mb-2"
          activeProps={{
            className:
              // Active state: use bg-primary/20 and text-primary for prominent accent
              "flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors mb-2",
          }}
          onClick={() => uiActions.setSidebar(false)}
          to="/sign-in"
        >
          <LogIn size={20} />
          <span className="font-medium">Sign in</span>
        </Link>
      </SignedOut>
    </>
  );
}
