import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sdk, sdkError } from "@/ory/sdk"
import { createFileRoute } from "@tanstack/react-router";

/**
 * Login is a React component that renders the login form using Ory Elements.
 * It is used to handle the login flow for a variety of authentication methods
 * and authentication levels (e.g. Single-Factor and Two-Factor)
 *
 * The Login component also handles the OAuth2 login flow (as an OAuth2 provider)
 * For more information regarding OAuth2 login, please see the following documentation:
 * https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow
 *
 */


export const Route = createFileRoute("/login")({
  component: Login,
});


function Login (){
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // The aal is set as a query parameter by your Ory project
  // aal1 is the default authentication level (Single-Factor)
  // aal2 is a query parameter that can be used to request Two-Factor authentication
  // https://www.ory.sh/docs/kratos/mfa/overview
  const aal2 = searchParams.get("aal2")
  console.log("aal2", aal2)

  // The login_challenge is a query parameter set by the Ory OAuth2 login flow
  // Switching between pages should keep the login_challenge in the URL so that the
  // OAuth flow can be completed upon completion of another flow (e.g. Registration).
  // https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow
  const loginChallenge = searchParams.get("login_challenge")
  console.log("loginChallenge", loginChallenge)

  // The return_to is a query parameter is set by you when you would like to redirect
  // the user back to a specific URL after login is successful
  // In most cases it is not necessary to set a return_to if the UI business logic is
  // handled by the SPA.
  //
  // In OAuth flows this value might be ignored in favor of keeping the OAuth flow
  // intact between multiple flows (e.g. Login -> Recovery -> Settings -> OAuth2 Consent)
  // https://www.ory.sh/docs/oauth2-oidc/identity-provider-integration-settings
  const returnTo = searchParams.get("return_to")
  console.log("returnTo", returnTo)

  const navigate = useNavigate()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback((flowId: string) => {
    console.log("Fetching Login flow with ID:", flowId);
    return sdk
      .getLoginFlow({ id: flowId })
      .then(({ data: flow }) => {
        console.log("Fetched Login Flow/data:", flow);
        setFlow(flow);
      })
      .catch(sdkErrorHandler);
  }, []);

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", true)

  // Create a new login flow
  const createFlow = () => {
    console.log("di createFlow login page")
    sdk
      .createBrowserLoginFlow({
        refresh: true,
        aal: aal2 ? "aal2" : "aal1",
        ...(loginChallenge && { loginChallenge: loginChallenge }),
        ...(returnTo && { returnTo: returnTo }),
      })
      // flow contains the form fields and csrf token
      .then(({ data: flow }) => {
        console.log("di createBrowserLoginFlow setelah berhasil createBrowserLoginFlow login data:", flow)
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id })
        // Set the flow data
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  // submit the login form data to Ory
  const submitFlow = (body: UpdateLoginFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/login", { replace: true })
    console.log("ini di submitFlow setelah berhasil updateLoginFlow body:", body)
    // we submit the flow to Ory with the form data
    sdk
      .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: body })
      .then(({data}) => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        console.log("ini di submitFlow setelah berhasil updateLoginFlow data:", data)
        navigate("/", { replace: true })
      })
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    console.log("di useEffect login page")
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = searchParams.get("flow")
    console.log("di useEffect login page flowId", flowId)
    // the flow already exists
    if (flowId) {
      console.log("di useEffe jika Flow ID exists, fetching flow id:", flowId)
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }

    // we assume there was no flow, so we create a new one
    createFlow()
  }, [aal2])

  // we check if the flow is set, if not we show a loading indicator
  return flow ? (
    // we render the login form using Ory Elements
    <UserAuthCard
      flowType={"login"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the login card should allow the user to go to the registration page and the recovery page
      additionalProps={{
        forgotPasswordURL: {
          handler: () => {
            const search = new URLSearchParams()
            if (flow.return_to) search.set("return_to", flow.return_to)
            navigate(
              {
                pathname: "/recovery",
                search: search.toString(),
              },
              { replace: true },
            )
          },
        },
        signupURL: {
          handler: () => {
            const search = new URLSearchParams()
            if (flow.return_to) search.set("return_to", flow.return_to)
            if (flow.oauth2_login_challenge)
              search.set("login_challenge", flow.oauth2_login_challenge)

            navigate(
              {
                pathname: "/registration",
                search: search.toString(),
              },
              { replace: true },
            )
          },
        },
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}
