import HeaderDashboard from "@/components/header-dashboard";
import SidebarLayout from "@/components/sidebar-layout";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import DashboardIcon from "/src/assets/dashboard.svg";
import { Card, CardTitle, P, H2, H3, CodeBox } from "@ory/themes"
import { DocsButton, MarginCard, LogoutLink } from "@/ory"
import { useState,useEffect } from "react";

import ory from '@/ory/sdk'
import { AxiosError } from "axios"

export const Route = createFileRoute("/")({
  // beforeLoad: async ({ context, location }) => {
  //   if (!context.auth.auth) {
  //     throw redirect({
  //       to: "/welcome",
  //       search: {
  //         redirect: location.href,
  //       },
  //     });
  //   }
  // },
  component: Index,
});

function Index() {
  console.log("index")
  const [session, setSession] = useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one.",
  )
  const [hasSession, setHasSession] = useState<boolean>(false)
  const onLogout = LogoutLink()
  const navigate = useNavigate()
  
  useEffect(() => {
    ory
      .toSession(undefined, { withCredentials: true })
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2))
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        console.error("Session Error:", err)
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return navigate({ to: "/login", search: { aal: "aal2" } })
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, [])


  return (
    <SidebarLayout>
      <HeaderDashboard
        icon={DashboardIcon}
        title1="Dashboard"
        title2="Dashboard"
      />
      <>
      <div className={"container-fluid"}>
      <div>
        <title>Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </div>

      <MarginCard wide>
        <CardTitle>Welcome to Ory!</CardTitle>
        <P>
          Welcome to the Ory Managed UI. This UI implements a run-of-the-mill
          user interface for all self-service flows (login, registration,
          recovery, verification, settings). The purpose of this UI is to help
          you get started quickly. In the long run, you probably want to
          implement your own custom user interface.
        </P>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="box">
              <H3>Documentation</H3>
              <P>
                Here are some useful documentation pieces that help you get
                started.
              </P>
              <div className="row">
                <DocsButton
                  title="Get Started"
                  href="https://www.ory.sh/docs/get-started"
                  testid="get-started"
                />
                <DocsButton
                  title="User Flows"
                  href="https://www.ory.sh/docs/concepts/self-service"
                  testid="user-flows"
                />
                <DocsButton
                  title="Identities"
                  href="https://www.ory.sh/docs/concepts/identity"
                  testid="identities"
                />
                <DocsButton
                  title="Sessions"
                  href="https://www.ory.sh/docs/concepts/session"
                  testid="sessions"
                />
                <DocsButton
                  title="Bring Your Own UI"
                  href="https://www.ory.sh/docs/guides/bring-your-user-interface"
                  testid="customize-ui"
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 col-xs-12">
            <div className="box">
              <H3>Session Information</H3>
              <P>
                Below you will find the decoded Ory Session if you are logged
                in.
              </P>
              <CodeBox data-testid="session-content" code={session} />
            </div>
          </div>
        </div>
      </MarginCard>

      <Card wide>
        <H2>Other User Interface Screens</H2>
        <div className={"row"}>
          <DocsButton
            unresponsive
            testid="login"
            href="/login"
            disabled={hasSession}
            title={"Login"}
          />
          <DocsButton
            unresponsive
            testid="sign-up"
            href="/register"
            disabled={hasSession}
            title={"Sign Up"}
          />
          <DocsButton
            unresponsive
            testid="recover-account"
            href="/recovery"
            disabled={hasSession}
            title="Recover Account"
          />
          <DocsButton
            unresponsive
            testid="verify-account"
            href="/verification"
            title="Verify Account"
          />
          <DocsButton
            unresponsive
            testid="account-settings"
            href="/settings"
            disabled={!hasSession}
            title={"Account Settings"}
          />
          <DocsButton
            unresponsive
            testid="logout"
            onClick={onLogout}
            disabled={!hasSession}
            title={"Logout"}
          />
        </div>
      </Card>
    </div>
      </>
    </SidebarLayout>
  );
}
