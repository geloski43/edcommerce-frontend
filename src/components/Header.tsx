import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import ClerkHeader from "../integrations/clerk/header-user.tsx";
import { uiStore, uiActions } from "../lib/ui-store.ts";
import { useUser } from "@clerk/clerk-react"; // Import useClerk
import {
  Home,
  X,
  Store,
  Sun,
  Moon,
  PanelLeftOpen,
  FileText,
  Layers,
  CircleEllipsis,
} from "lucide-react";

export default function Header() {
  const { user, isLoaded } = useUser();

  // 1. READ state from global store
  const sidebarOpen = useStore(uiStore, (s) => s.sidebarOpen);
  const currentTheme = useStore(uiStore, (s) => s.theme);

  // 2. Toggle theme using the global action
  const handleThemeToggle = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    uiActions.setTheme(newTheme);
  };

  // 3. Determine icons based on state
  const isDark = currentTheme === "dark";
  const ThemeIcon = isDark ? Sun : Moon;

  // Since shadcn uses 'primary' as the main accent,
  // we will map your lime/teal theme to Tailwind's default primary/secondary naming.
  // We will assume 'primary' maps to your accent color for styling gradients.
  const brandTextColorClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary";
  // NOTE: This assumes you configured 'primary' and 'secondary' colors in tailwind.config.js
  // that align with your lime/teal gradient.

  return (
    <>
      {/* -------------------- MAIN HEADER BAR -------------------- */}
      <header
        // Replaced custom theme classes with shadcn/ui standard classes:
        // bg-background (main app BG), border-border (primary border), text-foreground (main text)
        className="p-4 flex items-center bg-background border-b border-border text-foreground shadow-xl sticky top-0 z-40"
      >
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={() => uiActions.setSidebar(true)}
          // hover:bg-accent/50 is a common shadcn pattern for hover states
          className="p-2 hover:bg-accent/50 rounded-lg transition-colors text-foreground hover:text-primary"
          aria-label="Open menu"
        >
          <PanelLeftOpen size={24} />
        </button>

        {/* Logo Link with Image and Theme Border */}
        <div className="ml-4 flex items-center gap-3">
          <Link to="/">
            <img
              src="/edcommerce-logo.png"
              alt="EdCommerce Logo"
              // border-primary is the semantic name for the main accent color
              className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-md shadow-primary/50"
            />
          </Link>

          <h1 className="text-xl font-extrabold hidden sm:block">
            {/* The 'text-foreground' class handles light/dark mode text */}
            <span className="text-foreground opacity-70">ED</span>
            <span className={brandTextColorClass}>COMMERCE</span>
          </h1>
        </div>

        {/* Spacer to push user info to the right */}
        <div className="flex-1" />
      </header>

      {/* -------------------- SIDEBAR ASIDE -------------------- */}
      <aside
        // bg-card and text-card-foreground are shadcn's semantic names for component surfaces
        className={`fixed top-0 left-0 h-full w-80 bg-card text-card-foreground shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-primary/50">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={handleThemeToggle} // Calls the global state toggle
            // bg-muted is used for subtle backgrounds, text-muted-foreground for subdued text
            className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-primary"
          >
            <div className="flex items-center gap-3">
              <ThemeIcon size={20} />
            </div>
            {/* Display current theme name using the primary accent color */}
          </button>
          <button
            type="button"
            onClick={() => uiActions.setSidebar(false)}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-card-foreground opacity-70 hover:text-primary"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* -------------------- SIDEBAR CONTENT -------------------- */}
        {!isLoaded ? (
          /* 1. Loading State: Shown while Clerk is determining auth status */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="relative">
              <CircleEllipsis className="w-10 h-10 text-primary animate-spin" />
              <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
              Verifying Session...
            </p>
          </div>
        ) : user ? (
          /* 2. Authenticated State: Show full navigation */
          <nav className="flex-1 p-4 overflow-y-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-2 opacity-50">
              Menu
            </p>

            <Link
              to="/"
              onClick={() => uiActions.setSidebar(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2 text-card-foreground opacity-90"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors mb-2 text-primary",
              }}
            >
              <Home size={20} />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/cart"
              onClick={() => uiActions.setSidebar(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2 text-card-foreground opacity-90"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors mb-2 text-primary",
              }}
            >
              <Store size={20} />
              <span className="font-medium">Store</span>
            </Link>

            <Link
              to="/categories"
              onClick={() => uiActions.setSidebar(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2 text-card-foreground opacity-90"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors mb-2 text-primary",
              }}
            >
              <Layers size={20} />
              <span className="font-medium">Categories</span>
            </Link>

            <Link
              to="/orders"
              onClick={() => uiActions.setSidebar(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2 text-card-foreground opacity-90"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors mb-2 text-primary",
              }}
            >
              <FileText size={20} />
              <span className="font-medium">Orders</span>
            </Link>
          </nav>
        ) : /* 3. Unauthenticated State: Show nothing (null) or a Sign-In prompt */
        null}

        {/* Footer Section: Theme Switcher & ClerkHeader */}
        <div className="p-4 border-t-2 border-border bg-card flex flex-col gap-4">
          {/* User Auth (Clerk) */}
          <ClerkHeader />
        </div>
      </aside>
    </>
  );
}
