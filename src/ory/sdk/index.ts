// // original
// import { Configuration, FrontendApi } from "@ory/client"

// console.log(import.meta.env.VITE_PUBLIC_ORY_SDK_URL)


// export default new FrontendApi(
//   new Configuration({
//     basePath: import.meta.env.VITE_PUBLIC_ORY_SDK_URL, // ORY Cloud or self-hosted URL
//     baseOptions: { withCredentials: true }, // Ensures cookies are included in requests
//   })
// );



import { Configuration, FrontendApi } from "@ory/client"
import { AxiosError } from "axios"
import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export const sdk = new FrontendApi(
  new Configuration({
    //https://vitejs.dev/guide/env-and-mode.html#env-files
    basePath: import.meta.env.VITE_PUBLIC_ORY_SDK_URL,
    // we always want to include the cookies in each request
    // cookies are used for sessions and CSRF protection
    baseOptions: {
      withCredentials: true,
    },
  }),
)

/**
 * @param getFlow - Should be function to load a flow make it visible (Login.getFlow)
 * @param setFlow - Update flow data to view (Login.setFlow)
 * @param defaultNav - Default navigate target for errors
 * @param fatalToDash - When true and error can not be handled, then redirect to dashboard, else rethrow error
 */
export const sdkError = (
  getFlow: ((flowId: string) => Promise<void | AxiosError>) | undefined,
  setFlow: React.Dispatch<React.SetStateAction<any>> | undefined,
  defaultNav: string | undefined,
  fatalToDash = false,
) => {
   const navigate = useNavigate()

  return useCallback(
    (error: AxiosError<any, unknown>): Promise<AxiosError | void> => {
      const responseData = error.response?.data || {}

      switch (error.response?.status) {
        case 400: {
          if (error.response.data?.error?.id === "session_already_available") {
            console.log("sdkError 400: session_already_available"
            )
            navigate("/", { replace: true })
            return Promise.resolve()
          }
          // the request could contain invalid parameters which would set error messages in the flow
          if (setFlow !== undefined) {
            console.log("sdkError 400: update flow data")
            setFlow(responseData)
            return Promise.resolve()
          }
          break
        }
        case 401: {
          console.log("sdkError 401: Navigate to /login")
          navigate("/login", { replace: true })
          return Promise.resolve()
        }
        case 403: {
          // the user might have a session, but would require 2FA (Two-Factor Authentication)
          if (responseData.error?.id === "session_aal2_required") {
            navigate("/login?aal2=true", { replace: true })
            return Promise.resolve()
          }

          if (
            responseData.error?.id === "session_refresh_required" &&
            responseData.redirect_browser_to
          ) {
            console.log("sdkError 403: Redirect browser to")
            window.location = responseData.redirect_browser_to
            return Promise.resolve()
          }
          break
        }
        case 404: {
          if (defaultNav !== undefined) {
            const errorMsg = {
              data: error.response?.data || error,
              status: error.response?.status,
              statusText: error.response?.statusText,
              url: window.location.href,
            }
            
            console.log("sdkError 404: Navigate to Error",errorMsg)
            navigate(
              `/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`,
              {
                replace: true,
              },
            )
            return Promise.resolve()
          }
          break
        }
        case 410: {
          if (getFlow !== undefined && responseData.use_flow_id !== undefined) {
            return getFlow(responseData.use_flow_id).catch((error) => {
              // Something went seriously wrong - log and redirect to defaultNav if possible
              console.error(error)
              console.log("sdkError 410: Update flow",error)
              
              if (defaultNav !== undefined) {
                navigate(defaultNav, { replace: true })
              } else {
                // Rethrow error when can't navigate and let caller handle
                console.log("sdkError 410: Throw error",error)
                throw error
              }
            })
          } else if (defaultNav !== undefined) {
            console.log("sdkError 410: Navigate to", defaultNav)
            navigate(defaultNav, { replace: true })
            return Promise.resolve()
          }
          break
        }
        case 422: {
          if (responseData.redirect_browser_to !== undefined) {
            const currentUrl = new URL(window.location.href)
            const redirect = new URL(
              responseData.redirect_browser_to,
              // need to add the base url since the `redirect_browser_to` is a relative url with no hostname
              window.location.origin,
            )

            // Path has changed
            if (currentUrl.pathname !== redirect.pathname) {
              
              console.log("sdkError 422: Redirect to before remove /ui prefix", redirect.pathname + redirect.search)
              // remove /ui prefix from the path in case it is present (not setup correctly inside the project config)
              // since this is an SPA we don't need to redirect to the Account Experience.
              redirect.pathname = redirect.pathname.replace("/ui", "")
              console.log("sdkError 422: Redirect to after remove /ui prefix", redirect.pathname + redirect.search)

              if (redirect.pathname + redirect.search === "/self-service/login/browser?aal=aal2"){
                console.log("login 2fa : Redirect to /login?aal2=true")
                navigate("/login?aal2=true", { replace: true })
                return Promise.resolve()
              }

              navigate(redirect.pathname + redirect.search, {
                replace: true,
              })
              return Promise.resolve()
            }

            // for webauthn we need to reload the flow
            const flowId = redirect.searchParams.get("flow")

            if (flowId != null && getFlow !== undefined) {
              // get new flow data based on the flow id in the redirect url
              return getFlow(flowId).catch((error) => {
                // Something went seriously wrong - log and redirect to defaultNav if possible
                console.error(error)

                if (defaultNav !== undefined) {
                  navigate(defaultNav, { replace: true })
                } else {
                  // Rethrow error when can't navigate and let caller handle
                  throw error
                }
              })
            } else {
              window.location = responseData.redirect_browser_to
              console.log("sdkError 422: Redirect to", responseData.redirect_browser_to)
              return Promise.resolve()
            }
          }
        }
      }

      console.error(error)

      if (fatalToDash) {
        console.log("sdkError: fatal error redirect to dashboard")
        navigate("/", { replace: true })
        return Promise.resolve()
      }

      throw error
    },
    [navigate, getFlow],
  )
}