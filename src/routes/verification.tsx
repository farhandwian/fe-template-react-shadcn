/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client";
import { ActionCard, CenterLink, Flow, MarginCard } from "@/ory";
import { CardTitle } from "@ory/themes";

import ory from "@/ory/sdk";
// import { handleFlowError } from '@/ory/errors'
import { AxiosError } from "axios";
import { Link } from "react-router-dom";

export const Route = createFileRoute("/verification")({
  // beforeLoad: async ({ context, location }) => {
  //   if (context.auth.auth) {
  //     throw redirect({
  //       to: "/dashboard",
  //     });
  //   }
  // },
  component: VerificationPage,
});

function VerificationPage() {
  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<VerificationFlow>();
  const navigate = useNavigate();

  // Get ?flow=... from the URL
  // const { flow: flowId, return_to: returnTo } = router.query;
  const searchParams = Route.useSearch() as { flow?: string; return_to?: string }
  const flowId = searchParams?.flow;
  const returnTo = searchParams?.return_to;

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getVerificationFlow({ id: String(flowId) })
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
      .createBrowserVerificationFlow({
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
  }, [flowId, returnTo, flow]);

  const onSubmit = async (values: UpdateVerificationFlowBody) => {
    // await router
    //   // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    //   // his data when she/he reloads the page.
    //   .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true });

    navigate({
      to: "/verification",
      search: { flow: flow?.id },
      replace: true, // Prevents adding a new history entry
    });

    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then(async ({ data }) => {
        // Form submission was successful, show the message to the user!
        setFlow(data);
      })
      // .catch(handleFlowError(router, 'registration', setFlow))
      .catch((err) => {
        console.log("error", err);
        return Promise.reject(err);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data as VerificationFlow);
            return;
          case 410:
            const newFlowID = (err.response?.data as { use_flow_id: string })
              .use_flow_id;
            navigate({
              to: "/verification",
              search: { flow: newFlowID },
              replace: true, // Prevents adding a new history entry
            });

            ory
              .getVerificationFlow({ id: newFlowID })
              .then(({ data }) => setFlow(data));
            return;
        }

        throw err;
      });
  };

  return (
    <>
      <div>
        <title>Verify your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </div>
      <MarginCard>
        <CardTitle>Verify your account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <Link to="/">
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  );
}
