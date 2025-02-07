import { api } from "@/lib/dashboards/api-dashboard";
import {
  GetActivityListRequestSchema,
  GetActivityListResponseSchema,
  GetChartResponseSchema,
  GetChartTMARequestSchema,
  GetDevicesResponseSchema,
  GetDronesResponseSchema,
  GetGeneralInfoResponseSchema,
  GetInternetSpeedResponseSchema,
  GetMonitoringSystemResponseSchema,
  GetServiceStatusResponseSchema,
  GetSijagacaiResponseSchema,
  GetWaterAvailabilityForecastResponseSchema,
  GetWaterConditionListRequestSchema,
  GetWaterConditionListResponseSchema,
  GetWeatherForecastRequestSchema,
  GetWeatherForecastResponseSchema,
  GetWeatherLocationRequestSchema,
  GetWeatherLocationResponseSchema,
} from "@/lib/schema";
import { z } from "zod";

const EmptyRequestSchema = z.object({});

const getWaterAvailabilityForecast = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetWaterAvailabilityForecastResponseSchema>
>({
  method: "GET",
  path: "/dashboard/water-availability",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetWaterAvailabilityForecastResponseSchema,
});

const getActivities = api<
  z.infer<typeof GetActivityListRequestSchema>,
  z.infer<typeof GetActivityListResponseSchema>
>({
  method: "GET",
  path: "/dashboard/monitor/activity",
  requestSchema: GetActivityListRequestSchema,
  responseSchema: GetActivityListResponseSchema,
});

const getGeneralInfo = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetGeneralInfoResponseSchema>
>({
  method: "GET",
  path: "/dashboard/general-info",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetGeneralInfoResponseSchema,
});

const getWeatherForecast = api<
  z.infer<typeof GetWeatherForecastRequestSchema>,
  z.infer<typeof GetWeatherForecastResponseSchema>
>({
  method: "GET",
  path: "/dashboard/weather-forecast/:areaId",
  requestSchema: GetWeatherForecastRequestSchema,
  responseSchema: GetWeatherForecastResponseSchema,
});

const getWeatherLocation = api<
  z.infer<typeof GetWeatherLocationRequestSchema>,
  z.infer<typeof GetWeatherLocationResponseSchema>
>({
  method: "GET",
  path: "/dashboard/weather/location",
  requestSchema: GetWeatherLocationRequestSchema,
  responseSchema: GetWeatherLocationResponseSchema,
});

const getTMAChart = api<
  z.infer<typeof GetChartTMARequestSchema>,
  z.infer<typeof GetChartResponseSchema>
>({
  method: "GET",
  path: "/dashboard/chart-tma/:id",
  requestSchema: GetChartTMARequestSchema,
  responseSchema: GetChartResponseSchema,
});

const getWaterCondition = api<
  z.infer<typeof GetWaterConditionListRequestSchema>,
  z.infer<typeof GetWaterConditionListResponseSchema>
>({
  method: "GET",
  path: "/dashboard/main-water-channel-doors",
  requestSchema: GetWaterConditionListRequestSchema,
  responseSchema: GetWaterConditionListResponseSchema,
});

const getDevices = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetDevicesResponseSchema>
>({
  method: "GET",
  path: "/dashboard/device-status",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetDevicesResponseSchema,
});

const getInternetSpeed = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetInternetSpeedResponseSchema>
>({
  method: "GET",
  path: "/dashboard/speedtest-status",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetInternetSpeedResponseSchema,
});

const getSijagacai = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetSijagacaiResponseSchema>
>({
  method: "GET",
  path: "/dashboard/perizinan-status",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetSijagacaiResponseSchema,
});

const getMonitoringSystem = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetMonitoringSystemResponseSchema>
>({
  method: "GET",
  path: "/dashboard/monitoring-status",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetMonitoringSystemResponseSchema,
});

const getAutoDrone = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetDronesResponseSchema>
>({
  method: "GET",
  path: "/dashboard/drone-status",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetDronesResponseSchema,
});

const getStatusList = api<
  z.infer<typeof EmptyRequestSchema>,
  z.infer<typeof GetServiceStatusResponseSchema>
>({
  method: "GET",
  path: "/dashboard/service-status",
  requestSchema: EmptyRequestSchema,
  responseSchema: GetServiceStatusResponseSchema,
});

export const DashboardService = {
  getWaterAvailabilityForecast,
  getActivities,
  getGeneralInfo,
  getWeatherForecast,
  getTMAChart,
  getWaterCondition,
  getDevices,
  getInternetSpeed,
  getSijagacai,
  getMonitoringSystem,
  getAutoDrone,
  getStatusList,
  getWeatherLocation,
};
