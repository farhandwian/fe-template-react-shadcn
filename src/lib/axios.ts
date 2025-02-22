import { AuthService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store-kratos";
import { QueryClient } from "@tanstack/react-query";
import axios, {
  AxiosError,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios";

// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

const baseConfig: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

const baseDashboardConfig: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_DASHBOARD_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const instanceWithoutInterceptors: AxiosInstance =
  axios.create(baseConfig);
export const instance: AxiosInstance = axios.create(baseConfig);

export const dashboardInstanceWithoutInterceptors: AxiosInstance =
  axios.create(baseDashboardConfig);
export const dashboardInstance: AxiosInstance =
  axios.create(baseDashboardConfig);

// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// const subscribeTokenRefresh = (cb: (token: string) => void): void => {
//   console.log(
//     "New subscriber added, current count:",
//     refreshSubscribers.length + 1
//   );
//   refreshSubscribers.push(cb);
// };

// const onTokenRefreshed = (token: string): void => {
//   console.log(
//     "Token refreshed, notifying subscribers:",
//     refreshSubscribers.length
//   );
//   refreshSubscribers.forEach((cb) => cb(token));
//   refreshSubscribers = [];
// };

// const handleLogout = async (): Promise<void> => {
//   console.log("Handling logout");
//   refreshSubscribers = [];
//   isRefreshing = false;

//   const queryClient = new QueryClient();
//   await queryClient.clear();

//   useAuthStore.getState().clearUserInfo();
// };

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const userInfo = useAuthStore.getState().userInfo;
    console.log(
      "Making request with token:",
      userInfo ? "present" : "absent"
    );

    if (userInfo) {
      config.headers.Authorization = userInfo;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    console.log("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
// instance.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => {
//     console.log("Response received:", response.status);
//     return response;
//   },
//   async (error: AxiosError): Promise<unknown> => {
//     const originalRequest = error.config as
//       | CustomAxiosRequestConfig
//       | undefined;

//     console.log("Error in response:", {
//       status: error.response?.status,
//       isRefreshing,
//       retryFlag: originalRequest?._retry,
//       hasOriginalRequest: !!originalRequest,
//     });

//     // If not 401 or no original request, reject immediately
//     if (!error.response || error.response.status !== 401 || !originalRequest) {
//       return Promise.reject(error);
//     }

//     // If already retried, reject to prevent infinite loops
//     // if (originalRequest._retry) {
//     //   return Promise.reject(error);
//     // }

//     // originalRequest._retry = true;
//     // console.log("Processing 401 error, setting retry flag");

//     // // If a refresh is already in progress, queue this request
//     // if (isRefreshing) {
//     //   console.log("Refresh in progress, adding request to queue");
//     //   return new Promise((resolve) => {
//     //     subscribeTokenRefresh((token: string) => {
//     //       console.log("Subscriber executing with new token");
//     //       originalRequest.headers.Authorization = `Bearer ${token}`;
//     //       resolve(instance(originalRequest));
//     //     });
//     //   });
//     // }

//     // // Start the refresh process
//     // isRefreshing = true;
//     // console.log("Starting token refresh process");

//     try {
//       const refreshToken = useAuthStore.getState().auth?.refreshToken;
//       console.log("Refresh token present:", !!refreshToken);

//       if (!refreshToken) {
//         console.log("No refresh token, logging out");
//         await handleLogout();
//         return Promise.reject(error);
//       }

//       console.log("Calling refresh token API");
//       const response = await AuthService.refreshToken({
//         refresh_token: refreshToken,
//       });

//       console.log("Refresh token API success");
//       const newAccessToken = response.data.access_token;

//       useAuthStore.setState({
//         auth: {
//           ...useAuthStore.getState().auth!,
//           accessToken: newAccessToken,
//         },
//       });

//       // Update original request authorization header
//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//       // Notify all subscribers and reset state
//       console.log("Notifying subscribers and resetting state");
//       onTokenRefreshed(newAccessToken);
//       isRefreshing = false;

//       // Retry the original request
//       console.log("Retrying original request");
//       return instance(originalRequest);
//     } catch (refreshError) {
//       console.log("Refresh token request failed:", refreshError);
//       isRefreshing = false;
//       await handleLogout();
//       return Promise.reject(refreshError);
//     }
//   }
// );

// dashboard instance
// Request interceptor
// dashboardInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     const accessToken = useAuthStore.getState().auth?.accessToken;
//     console.log(
//       "Making request with token:",
//       accessToken ? "present" : "absent"
//     );

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error: AxiosError): Promise<never> => {
//     console.log("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// dashboardInstance.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => {
//     console.log("Response received:", response.status);
//     return response;
//   },
//   async (error: AxiosError): Promise<unknown> => {
//     const originalRequest = error.config as
//       | CustomAxiosRequestConfig
//       | undefined;

//     console.log("Error in response:", {
//       status: error.response?.status,
//       isRefreshing,
//       retryFlag: originalRequest?._retry,
//       hasOriginalRequest: !!originalRequest,
//     });

//     // If not 401 or no original request, reject immediately
//     if (!error.response || error.response.status !== 401 || !originalRequest) {
//       return Promise.reject(error);
//     }

//     // If already retried, reject to prevent infinite loops
//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;
//     console.log("Processing 401 error, setting retry flag");

//     // If a refresh is already in progress, queue this request
//     if (isRefreshing) {
//       console.log("Refresh in progress, adding request to queue");
//       return new Promise((resolve) => {
//         subscribeTokenRefresh((token: string) => {
//           console.log("Subscriber executing with new token");
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           resolve(dashboardInstance(originalRequest));
//         });
//       });
//     }

//     // Start the refresh process
//     isRefreshing = true;
//     console.log("Starting token refresh process");

//     try {
//       const refreshToken = useAuthStore.getState().auth?.refreshToken;
//       console.log("Refresh token present:", !!refreshToken);

//       if (!refreshToken) {
//         console.log("No refresh token, logging out");
//         await handleLogout();
//         return Promise.reject(error);
//       }

//       console.log("Calling refresh token API");
//       const response = await AuthService.refreshToken({
//         refresh_token: refreshToken,
//       });

//       console.log("Refresh token API success");
//       const newAccessToken = response.data.access_token;

//       useAuthStore.setState({
//         auth: {
//           ...useAuthStore.getState().auth!,
//           accessToken: newAccessToken,
//         },
//       });

//       // Update original request authorization header
//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//       // Notify all subscribers and reset state
//       console.log("Notifying subscribers and resetting state");
//       onTokenRefreshed(newAccessToken);
//       isRefreshing = false;

//       // Retry the original request
//       console.log("Retrying original request");
//       return dashboardInstance(originalRequest);
//     } catch (refreshError) {
//       console.log("Refresh token request failed:", refreshError);
//       isRefreshing = false;
//       await handleLogout();
//       return Promise.reject(refreshError);
//     }
//   }
// );
