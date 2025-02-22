// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { UserAuthCard } from "@ory/elements";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sdk, sdkError } from "@/ory/sdk";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recovery")({
  component: Recovery,
});

function Recovery() {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  //   // Fetch an existing Recovery flow
  const getFlow = useCallback((flowId: string) => {
    console.log("Fetching Recovery flow with ID:", flowId);
    return sdk
      .getRecoveryFlow({ id: flowId })
      .then(({ data: flow }) => {
        console.log("Fetched Recovery Flow:", flow);
        setFlow(flow);
      })
      .catch(sdkErrorHandler);
  }, []);

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/recovery");

  // create a new recovery flow
  const createFlow = () => {
    sdk
      .createBrowserRecoveryFlow()
      // flow contains the form fields, error messages and csrf token
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id });
        // Set the flow data
        setFlow(flow);
      })
      .catch(sdkErrorHandler);
  };

  const submitFlow = (body: UpdateRecoveryFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/login", { replace: true });

    sdk
      .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        console.log(
          "ini di submitflow setelah berhasil updateRecoveryFlow recovery",
          data
        );
        setFlow(data);

        if ("continue_with" in data && Array.isArray(data.continue_with)) {
          console.log(
            "ini di submit flow register page data.continue_with:" +
              data.continue_with
          );
          for (const cw of data.continue_with ?? []) {
            if (cw.action === "show_settings_ui") {
              console.log(
                "ini di submit flow recovery page Redirecting to verification page with cw flow id",
                cw.flow.id
              );
              const search = new URLSearchParams();
              search.set("flow", cw.flow.id);
              search.set("type", "show_settings_ui");
              navigate(
                {
                  pathname: "/setting",
                  search: search.toString(),
                },
                { replace: true }
              );
              return;
            }
          }
        }
      })
      .catch(sdkErrorHandler);
  };

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = searchParams.get("flow");
    console.log("ini flowId di useeffect recovery", flowId);
    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow); // if for some reason the flow has expired, we need to get a new one
      return;
    }
    // we assume there was no flow, so we create a new one
    createFlow();
  }, []);

  // we check if the flow is set, if not we show a loading indicator
  return flow ? (
    // We create a dynamic Recovery form based on the flow using Ory Elements
    <UserAuthCard
      flowType={"recovery"}
      // the flow is always required since it contains the UI form elements, UI error messages and csrf token
      flow={flow}
      // the recovery form should allow users to navigate to the login page
      additionalProps={{
        loginURL: {
          handler: () => {
            navigate(
              {
                pathname: "/login",
              },
              { replace: true }
            );
          },
        },
      }}
      // submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  );
}
