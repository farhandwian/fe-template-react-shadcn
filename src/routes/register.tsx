/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import { ActionCard, CenterLink, Flow, MarginCard } from "@/ory";
import { CardTitle } from "@ory/themes";

import ory from "@/ory/sdk";
// import { handleFlowError } from '@/ory/errors'
import { AxiosError } from "axios";

export const Route = createFileRoute("/register")({
  component: RegistrationPage,
});

function RegistrationPage() {
  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<RegistrationFlow>();
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Get ?flow=... from the URL
  // const { flow: flowId, return_to: returnTo } = router.query;
  const searchParams = Route.useSearch() as {
    flow?: string;
    return_to?: string;
  };
  const flowId = searchParams?.flow;
  const returnTo = searchParams?.return_to;

  console.log("flowId", flowId);
  console.log("returnTo", returnTo);

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
        .getRegistrationFlow({ id: String(flowId) })
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
      .createBrowserRegistrationFlow({
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
  }, [flowId, returnTo, flow, isInitialized]);

  const onSubmit = async (values: UpdateRegistrationFlowBody) => {
    // await router
    //   // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    //   // his data when she/he reloads the page.
    //   .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true });

    navigate({
      to: "/register",
      search: { flow: flow?.id },
      replace: true, // Prevents adding a new history entry
    });

    ory
      .updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
      .then(async ({ data }) => {
        // If we ended up here, it means we are successfully signed up!
        //
        // You can do cool stuff here, like having access to the identity which just signed up:
        console.log("This is the user session: ", data, data.identity);

        // continue_with is a list of actions that the user might need to take before the registration is complete.
        // It could, for example, contain a link to the verification form.
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                navigate({
                  to: "/verification",
                  search: { flow: item.flow.id },
                });
                return;
            }
          }
        }

        // If continue_with did not contain anything, we can just return to the home page.
        //  await router.push(flow?.return_to || '/')
        navigate({
          to: flow?.return_to || "/",
        });
      })
      // .catch(handleFlowError(router, 'registration', setFlow))
      .catch((err) => {
        console.log("error", err);
        return Promise.reject(err);
      })
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data as RegistrationFlow);
          return;
        }

        return Promise.reject(err);
      });
  };

  return (
    <>
      <div>
        <title>Create account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </div>
      <MarginCard>
        <CardTitle>Create account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <CenterLink data-testid="cta-link" href="/login">
          Sign in
        </CenterLink>
      </ActionCard>
    </>
  );
}


