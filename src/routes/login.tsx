/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { ActionCard, CenterLink, Flow, MarginCard, LogoutLink } from "@/ory";
import { CardTitle } from "@ory/themes";

import ory from "@/ory/sdk";
// import { handleFlowError } from '@/ory/errors'
import { AxiosError } from "axios";
import { Link } from "react-router-dom";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<LoginFlow>();
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();

  // Get ?flow=... from the URL
  // const { flow: flowId, return_to: returnTo } = router.query;
  const searchParams = Route.useSearch() as {
    flow?: string;
    return_to?: string;
    refresh?: string;
    aal?: string;
  };
  const flowId = searchParams?.flow;
  const returnTo = searchParams?.return_to;
  const refresh = searchParams?.refresh;
  const aal = searchParams?.aal;

  console.log("flowId", flowId);
  console.log("returnTo", returnTo);

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh]);

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data);
        })
        // .catch(handleFlowError(router, "registration", setFlow));
        .catch((err) => {
          console.log("error", err);
          return Promise.reject(err);
        });
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ? String(aal) : undefined,
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data);
      })
      // .catch(handleFlowError(router, "registration", setFlow));
      .catch((err) => {
        console.log("error", err);
        return Promise.reject(err);
      });
  }, [flowId, returnTo, refresh, aal, flow, isInitialized]);

  const onSubmit = async (values: UpdateLoginFlowBody) => {
    // await router
    //   // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    //   // his data when she/he reloads the page.
    //   .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true });

    navigate({
      to: "/login",
      search: { flow: flow?.id },
      replace: true, // Prevents adding a new history entry
    });

    ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      .then(async () => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to;
          return;
        }
        navigate({
          to: "/",
        });
      })
      .then(() => {})
      // .catch(handleFlowError(router, 'registration', setFlow))
      .catch((err) => {
        console.log("error", err);
        return Promise.reject(err);
      })
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data as LoginFlow);
          return;
        }

        return Promise.reject(err);
      });
  };

  return (
    <>
      <div>
        <title>Sign in - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </div>
      <MarginCard>
        <CardTitle>
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action";
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication";
            }
            return "Sign In";
          })()}
        </CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      {aal || refresh ? (
        <ActionCard>
          <CenterLink data-testid="logout-link" onClick={onLogout}>
            Log out
          </CenterLink>
        </ActionCard>
      ) : (
        <>
          <ActionCard>
            <Link to="/register">
              <CenterLink>Create account</CenterLink>
            </Link>
          </ActionCard>
          <ActionCard>
            <Link to="/recovery">
              <CenterLink>Recover your account</CenterLink>
            </Link>
          </ActionCard>
        </>
      )}
    </>
  );
}
