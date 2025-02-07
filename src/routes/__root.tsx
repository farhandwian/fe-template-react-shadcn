import { AuthContext } from "@/contexts/auth-context";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { BrowserRouter as Router } from "react-router-dom";

interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Router>
      <Root />
    </Router>
  ),
});

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
