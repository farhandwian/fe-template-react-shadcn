import { createFileRoute } from "@tanstack/react-router";
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import {
  gridStyle,
  NodeMessages,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sdk, sdkError } from "@/ory/sdk";

export const Route = createFileRoute("/setting")({
  component: Setting,
});

function Setting() {
  console.log("masuk setting page");
  const [flow, setFlow] = useState<SettingsFlow | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const flowId = searchParams.get("flow");
  console.log("flowId setting page", flowId);

  const type = searchParams.get("type");
  console.log("type setting page", type);

  const navigate = useNavigate();

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
//   const getFlow = useCallback(
//     (flowId: string) =>
//       sdk
//         // the flow data contains the form fields, error messages and csrf token
//         .getSettingsFlow({ id: flowId })
//         .then(({ data: flow }) => setFlow(flow))
//         .catch(sdkErrorHandler),
//     []
//   );

  const getFlow = useCallback((flowId: string) => {
    console.log("Fetching setting flow with ID:", flowId);
    return sdk
      .getSettingsFlow({ id: flowId })
      .then(({ data: flow }) => {
        console.log("Fetched setting Flow:", flow);
        setFlow(flow);
      })
      .catch(sdkErrorHandler);
  }, []);

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/settings", true);

  const createFlow = () => {
    sdk
      // create a new settings flow
      // the flow contains the form fields, error messages and csrf token
      // depending on the Ory Network project settings, the form fields returned may vary
      .createBrowserSettingsFlow()
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id });
        // Set the flow data
        setFlow(flow);
      })
      .catch(sdkErrorHandler);
  };

  // submit any of the settings form data to Ory
  const onSubmit = (body: UpdateSettingsFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/settings", { replace: true });

    sdk
      // submit the form data the user provided to Ory
      .updateSettingsFlow({ flow: flow.id, updateSettingsFlowBody: body })
      .then(({ data: flow }) => {
        console.log(
          "ini di submitflow setelah berhasil updateSettingsFlow setting",
          flow
        );
        setFlow(flow);
      })
      .catch(sdkErrorHandler);
  };

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    // the flow already exists
    if (flowId && type === "show_settings_ui") {
      console.log("masuk ke flowId dan type show_settings_ui flowid:",flowId);
      getFlow(flowId).catch(createFlow); // if for some reason the flow has expired, we need to get a new one
      return;
    }
    // createFlow();
  }, [flowId, type]);

  // if the flow is not set, we show a loading indicator
  return flow ? (
    <div className={gridStyle({ gap: 16 })}>
      <NodeMessages uiMessages={flow.ui.messages} />
      tes123change jsx
      {/* <div className="w-96"> */}

         {/* here we simply map all of the settings flows we could have. These flows won't render if they aren't enabled inside your Ory Network project */}
      {(
        [
          "profile",
          "password",
          "totp",
          "webauthn",
          "lookup_secret",
          "oidc",
        ] as UserSettingsFlowType[]
      ).map((flowType: UserSettingsFlowType, index) => (
        // here we render the settings flow using Ory Elements
        <UserSettingsCard
          key={index}
          // we always need to pass the component the flow since it contains the form fields, error messages and csrf token
          flow={flow}
          method={flowType}
          // include scripts for webauthn support
          includeScripts={true}
          // submit the form data the user provides to Ory
          onSubmit={({ body }) => onSubmit(body as UpdateSettingsFlowBody)}
          className="bg-red-400"
        />
      ))}
      {/* </div> */}
     
    </div>
  ) : (
    <div>Loading...</div>
  );
}
