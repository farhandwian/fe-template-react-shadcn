import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { useAuth } from "./hooks/use-auth";
import { AuthProvider } from "./providers/auth-provider";
import { QueryProvider } from "./providers/query-provider";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import MessageEvent from "./components/message-event";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  const sseUrl = import.meta.env.VITE_SSE_URL;
  return (
    <QueryProvider>
      <AuthProvider>
        <MessageEvent sseUrl={sseUrl}>
          <InnerApp />
          <Toaster />
          <SonnerToaster
            richColors
            position="top-right"
            visibleToasts={15}
            closeButton={true}
          />
        </MessageEvent>
      </AuthProvider>
    </QueryProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
