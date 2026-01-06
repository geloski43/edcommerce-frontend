import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useState, useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import { uiStore, uiActions } from "../lib/ui-store.ts";
import GlobalError from "@/components/GlobalError";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotFound from "../components/NotFound.tsx";
import ClerkProvider from "../integrations/clerk/provider";
import StoreDevtools from "../lib/demo-store-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { AuthSync } from "@/components/AuthSync";
import { OrderSync } from "@/components/OrderSync";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: GlobalError,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const currentTheme = useStore(uiStore, (s) => s.theme);

  useEffect(() => {
    // 1. Sync the store with localStorage immediately on mount
    uiActions.hydrateTheme();
    // 2. Mark as mounted to allow the UI to switch to the user's theme
    setIsMounted(true);
  }, []);

  const themeStyles = {
    light: {
      "--app-bg-color": "rgb(255 255 255)",
      "--app-text-color": "rgb(15 23 42)",
    },
    dark: {
      "--app-bg-color": "rgb(0 0 0)",
      "--app-text-color": "rgb(226 232 240)",
    },
  };

  // Logic: Server/Hydration pass uses 'dark'.
  // After useEffect runs, it uses the persisted 'currentTheme'.
  const activeTheme = isMounted ? currentTheme : "dark";

  const themeClass = activeTheme === "dark" ? "dark" : "light";
  const currentStyles = themeStyles[activeTheme === "dark" ? "dark" : "light"];
  return (
    // 2. APPLY THEME CLASS TO THE <html> ELEMENT
    <html
      lang="en"
      className={themeClass}
      style={currentStyles as React.CSSProperties}
    >
      <head>
        <HeadContent />
      </head>

      {/* Note: The 'body' tag already uses theme classes via styles.css */}
      <body className="min-h-screen flex flex-col">
        <ClerkProvider>
          {/* 2. AUTH SYNC: Runs globally inside the provider */}
          <AuthSync />
          <OrderSync />
          <Header />

          {/* Page content grows and pushes footer to bottom */}
          <main className="flex-1 flex flex-col min-h-0">{children}</main>

          <TanStackDevtools
            config={{
              position: "bottom-right",
              triggerImage: "/edcommerce-logo.png",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              StoreDevtools,
              TanStackQueryDevtools,
            ]}
          />

          <Footer />
        </ClerkProvider>

        <Scripts />
      </body>
    </html>
  );
}
