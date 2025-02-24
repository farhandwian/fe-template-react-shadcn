import {
  ThemeProvider,
  IntlProvider,
  CustomTranslations,
  CustomLanguageFormats,
  locales,
} from "@ory/elements";

// optional global css reset
import "@ory/elements/assets/normalize.css";
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

// Ory Elements
// optional fontawesome icons
import "@ory/elements/assets/fa-brands.min.css";
import "@ory/elements/assets/fa-solid.min.css";
import "@ory/elements/assets/fontawesome.min.css";

// optional fonts
import "@ory/elements/assets/inter-font.css";
import "@ory/elements/assets/jetbrains-mono-font.css";

// required styles for Ory Elements
import "@ory/elements/style.css";

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
  const customTranslations: CustomLanguageFormats = {
    en: {
      ...locales.en,
      // Tambahkan terjemahan kustom Anda di sini
    },
    // Tambahkan bahasa lain jika diperlukan
  };

  return (
    <QueryProvider>
      <AuthProvider>
        <IntlProvider
          locale="en"
          defaultLocale="en"
        >
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
        </IntlProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      {/* <ThemeProvider themeOverrides={{}}> */}
        <App />
      {/* </ThemeProvider> */}
    </StrictMode>
  );
}
