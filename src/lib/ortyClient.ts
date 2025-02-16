import { FrontendApi, Configuration } from "@ory/client";

const ORY_KRATOS_URL = "http://localhost:4433";

const ory = new FrontendApi(
  new Configuration({
    basePath: ORY_KRATOS_URL,
    baseOptions: { withCredentials: true },
  })
);

export default ory;