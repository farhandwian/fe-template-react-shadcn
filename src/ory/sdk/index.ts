// original
import { Configuration, FrontendApi } from "@ory/client"

console.log(import.meta.env.VITE_PUBLIC_ORY_SDK_URL)


export default new FrontendApi(
  new Configuration({
    basePath: import.meta.env.VITE_PUBLIC_ORY_SDK_URL, // ORY Cloud or self-hosted URL
    baseOptions: { withCredentials: true }, // Ensures cookies are included in requests
  })
);
