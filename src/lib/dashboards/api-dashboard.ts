import { AxiosRequestConfig, Method } from "axios";
import { z } from "zod";
import {
  dashboardInstance,
  dashboardInstanceWithoutInterceptors,
} from "../axios";

interface APICallPayload<Request, Response> {
  method: Method;
  path: string;
  requestSchema: z.ZodType<Request>;
  responseSchema: z.ZodType<Response>;
  type?: "public" | "private";
}

export function api<Request, Response>({
  type = "private",
  method,
  path,
  requestSchema,
  responseSchema,
}: APICallPayload<Request, Response>) {
  return async (requestData: Request) => {
    // Validate request data
    requestSchema.parse(requestData);

    // Prepare API call
    let url = path;
    let data = null;

    // check if the url has dynamic parameters
    if (path.includes(":")) {
      const pathArray = path.split("/");
      const dynamicParam = pathArray.find((param: string) =>
        param.startsWith(":")
      );

      if (dynamicParam) {
        const param = dynamicParam.slice(1);
        url = path.replace(
          dynamicParam,
          (requestData as Record<string, never>)[param]
        );
        // Remove the dynamic param from the request data
        delete (requestData as Record<string, never>)[param];
      }
    }

    if (requestData) {
      if (method === "GET" || method === "DELETE") {
        url += `${url.includes("?") ? "&" : "?"}${new URLSearchParams(
          requestData as Record<string, string>
        )}`;

        // if the ? is the last character, remove it
        if (url.endsWith("?")) {
          url = url.slice(0, -1);
        }
      } else {
        data = requestData;
      }
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
    };

    // Make API call base on the type of request
    const response =
      type === "private"
        ? await dashboardInstance(config)
        : await dashboardInstanceWithoutInterceptors(config);

    // Parse and validate response data
    const result = responseSchema.safeParse(response.data);

    if (!result.success) {
      console.error("🚨 Safe-Parsing Failed ", result.error);
      throw new Error(result.error.message);
    } else {
      return result.data;
    }
  };
}
