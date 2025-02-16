// import { AxiosError } from "axios"
// import { useRouter } from "next/router"
// import { useState, useEffect, DependencyList } from "react"

// import ory from "./sdk"

// // Returns a function which will log the user out
// export function LogoutLink(deps?: DependencyList) {
//   const [logoutToken, setLogoutToken] = useState<string>("")
//   const router = useRouter()

//   useEffect(() => {
//     ory
//       .createBrowserLogoutFlow()
//       .then(({ data }) => {
//         setLogoutToken(data.logout_token)
//       })
//       .catch((err: AxiosError) => {
//         switch (err.response?.status) {
//           case 401:
//             // do nothing, the user is not logged in
//             return
//         }

//         // Something else happened!
//         return Promise.reject(err)
//       })
//   }, deps)

//   return () => {
//     if (logoutToken) {
//       ory
//         .updateLogoutFlow({ token: logoutToken })
//         .then(() => router.push("/login"))
//         .then(() => router.reload())
//     }
//   }
// }


import { AxiosError } from "axios"
import { useState, useEffect, DependencyList } from "react"
import { useNavigate } from "@tanstack/react-router"

import ory from "./sdk"

// Returns a function which will log the user out
export function LogoutLink(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    ory
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          // do nothing, the user is not logged in
          return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, deps)

  return () => {
    if (logoutToken) {
      ory
        .updateLogoutFlow({ token: logoutToken })
        .then(() => navigate({ to: "/login" })) // ✅ Replaces `router.push("/login")`
        .then(() => window.location.reload()) // ✅ Replaces `router.reload()`
    }
  }
}
