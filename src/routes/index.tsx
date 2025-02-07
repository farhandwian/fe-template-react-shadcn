import ActivityMonitoring from "@/components/features/dashboard/activity-monitoring";
import AutonomousDrone from "@/components/features/dashboard/autonomus-drone";
import Device from "@/components/features/dashboard/device";
import EstimatedWaterAvailability from "@/components/features/dashboard/estimated-water-availability";
import InternetSpeed from "@/components/features/dashboard/internet-speed";
import MonitoringSysten from "@/components/features/dashboard/monitoring-system-alert";
import Sijagacai from "@/components/features/dashboard/sijagacai";
import Status from "@/components/features/dashboard/status";
import Summary from "@/components/features/dashboard/summary";
import TMAChart from "@/components/features/dashboard/tma-chart";
import UnFulfilledDoors from "@/components/features/dashboard/unfulfilled-doors";
import WaterAvailability from "@/components/features/dashboard/water-availability";
import WaterCondition from "@/components/features/dashboard/water-condition";
import WeatherForecast from "@/components/features/dashboard/weather-forecast";
import HeaderDashboard from "@/components/header-dashboard";
import SidebarLayout from "@/components/sidebar-layout";
import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardIcon from "/src/assets/dashboard.svg";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.auth) {
      throw redirect({
        to: "/welcome",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

function Index() {
  return (
    <SidebarLayout>
      <HeaderDashboard
        icon={DashboardIcon}
        title1="Dashboard"
        title2="Dashboard"
      />

      <div className="mt-6 space-y-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Perangkat */}
          <Device />

          {/* Internet Speed */}
          <InternetSpeed />
        </div>

        {/* Perkiraan Cuaca */}
        <WeatherForecast />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* SijagaCai */}
          <Sijagacai />
          {/* Monitoring System Alert */}
          <MonitoringSysten />
          {/* Drone */}
          <AutonomousDrone />
        </div>

        {/* Status */}
        <Status />

        <div className="bg-white rounded-xl">
          {/* Ringkasan */}
          <Summary />

          {/* Kondisi Pemenuhan Air Irigasi */}
          <WaterCondition />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 px-6">
            <TMAChart />
            <WaterAvailability />
          </div>
          <div className="px-6">
            <div className="h-[1px] w-full bg-[#BACBEC] mt-8" />
          </div>

          {/* Perkiraan Ketersediaan Air Bendung Manganti */}
          <EstimatedWaterAvailability />

          {/* Daftar Pintu Yang Tidak Terpenuhi */}
          <UnFulfilledDoors />
        </div>

        {/* Monitoring Aktivitas */}
        <ActivityMonitoring />
      </div>
    </SidebarLayout>
  );
}
