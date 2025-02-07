import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AlarmService } from "@/services/alarm-config";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CriticalIcon from "/src/assets/alert.svg";
import NotifIcon from "/src/assets/notification.svg";
import WarningIcon from "/src/assets/warning.svg";
import { Loader } from "lucide-react";

const Notifications = () => {
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now.getTime() - notificationDate.getTime();

    if (diff < 60 * 1000) return "Baru Saja";
    if (diff < 60 * 60 * 1000)
      return `${Math.floor(diff / (60 * 1000))} Menit yang lalu`;
    if (diff < 24 * 60 * 60 * 1000)
      return `${Math.floor(diff / (60 * 60 * 1000))} Jam yang lalu`;
    if (diff < 48 * 60 * 60 * 1000) return "Kemarin";

    return notificationDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const { data: historiesData, isLoading } = useQuery({
    queryKey: ["histories"],
    queryFn: () =>
      AlarmService.getAlarmHistoryList({
        size: 5,
        page: 1,
        sort_by: "created_at",
        sort_order: "desc",
      }),
  });

  const histories = historiesData?.data?.alarm_histories || [];
  const totalHistories =
    historiesData?.data?.metadata?.pagination?.total_items || 0;

  // tma_threshold
  // pda_threshold
  // debit_threshold
  // pch_threshold
  // tma_prediction

  // tma, pda, debit
  // Template
  // Kondisi [tma] pada [saluran/pos] sudah mencapai [kurang dari/sama dengan/lebih dari] [nilai] [satuan].
  const template =
    "Kondisi [metric] pada [location] [channel_name] sudah mencapai [condition] [value] [unit].";
  const templatePrediction =
    "Prediksi [prediction_interval] [prediction_unit] ke depan [metric] pada [location] [channel_name] akan mencapai [condition] [value] [unit].";

  function getCondition(condition: string) {
    switch (condition) {
      case "less_than":
        return "kurang dari";
      case "less_than_equal":
        return "kurang dari atau sama dengan";
      case "equal":
        return "sama dengan";
      case "greater_than":
        return "lebih dari";
      case "greater_than_equal":
        return "lebih dari atau sama dengan";
      default:
        return "";
    }
  }

  function generateMetricName(metric: string) {
    switch (metric) {
      case "tma_threshold":
        metric = "Tinggi Muka Air";
        break;
      case "pda_threshold":
        metric = "Duga air";
        break;
      case "debit_threshold":
        metric = "Debit";
        break;
      case "pch_threshold":
        metric = "Curah Hujan";
        break;
      case "tma_prediction":
        metric = "Tinggi Muka Air";
        break;
      default:
        break;
    }
    return metric;
  }

  function getUnit(metric: string) {
    switch(metric) {
      case "Tinggi Muka Air":
        metric = "cm";
        break;
      case "Duga air":
        metric = "cm";
        break;
      case "Debit":
        metric = "lt/dt";
        break;
      case "Curah Hujan":
        metric = "";
        break;
    }
    return metric;
  }

  function generateTemplate(alert: {
    priority: string;
    metric: string;
    values: number;
    status: string;
    id: string;
    channel_id: number;
    channel_name: string;
    condition_operator: string;
    condition_value: number;
    condition_duration: number;
    condition_unit: string;
    alarm_config_uid: string;
    created_at: string;
    prediction_interval?: number;
    prediction_unit?: string;
  }) {
    let alertMessage = "";
    // tma_threshold
    // pda_threshold
    // debit_threshold
    // pch_threshold
    // tma_prediction

    if (alert.metric !== "tma_prediction") {
      alertMessage = template
        .replace("[metric]", generateMetricName(alert.metric))
        .replace(
          "[location]",
          alert.metric === "pda_threshold" || alert.metric === "pch_threshold"
            ? "Pos"
            : "Saluran"
        )
        .replace("[channel_name]", alert.channel_name)
        .replace("[condition]", getCondition(alert.condition_operator))
        .replace("[value]", alert.condition_value.toFixed(0).toString())
        .replace("[unit]", getUnit(generateMetricName(alert.metric)));
      } else {
      alertMessage = templatePrediction
        .replace("[metric]", generateMetricName(alert.metric))
        .replace("[location]", "Saluran")
        .replace("[channel_name]", alert.channel_name)
        .replace("[condition]", getCondition(alert.condition_operator))
        .replace("[value]", alert.condition_value.toFixed(0).toString())
        .replace("[unit]", getUnit(generateMetricName(alert.metric)))
        .replace(
          "[prediction_interval]",
          alert?.prediction_interval ? alert.prediction_interval.toString() : ""
        )
        .replace(
          "[prediction_unit]",
          alert?.prediction_unit ? alert.prediction_unit : ""
        );
    }
    return alertMessage;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Button
              variant="outline"
              className="relative flex border-none bg-primary-brand-100 w-fit rounded-xl items-center justify-center p-3"
            >
              <img src={NotifIcon} alt="Notification" />
              <div className="absolute top-1 right-1 flex items-center justify-center">
                <div className="h-[22px] w-[22px] bg-primary-brand-100 rounded-full flex items-center justify-center">
                  <div className="h-[20px] w-[20px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                    {totalHistories > 99 ? "99+" : totalHistories}
                  </div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="w-[400px] max-h-[800px] overflow-y-auto p-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <>
                {histories.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className="border-b last:border-none px-4 py-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <img
                        src={
                          notification.priority === "critical"
                            ? CriticalIcon
                            : WarningIcon
                        }
                        alt={notification.priority}
                      />
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span
                            className={`font-bold ${
                              notification.priority === "critical"
                                ? "text-red-600"
                                : "text-warning-600"
                            }`}
                          >
                            {notification.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-xs">
                          {generateTemplate(notification)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center bg-[#E9EAFF]">
                  <Link to="/alert-system/history">
                    <Button variant="link">
                      <div className="text-primary-brand-500 flex gap-2 items-center">
                        <span className="font-bold">Lihat Semua</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Notifications;
