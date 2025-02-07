import { useAuth } from "@/hooks/use-auth";
import { AlertData } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type EventSubject = "alert";

interface EventMessage<T = unknown> {
  subject: EventSubject;
  function_name: string;
  data: T;
}

interface MessageEventProps {
  children: React.ReactNode;
  sseUrl: string;
}

type ConnectionStatus = "connected" | "disconnected" | "reconnecting";
type MessageHandler<T = unknown> = (message: EventMessage<T>) => void;

const MessageEvent = ({ children, sseUrl }: MessageEventProps) => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  console.log("connectionStatus", connectionStatus);
  console.log("error", error);
  const auth = useAuth();

  const handleAlert: MessageHandler<AlertData> = (message) => {
    const template =
      "Kondisi [metric] pada saluran [channel_name] pintu [door_name] sudah mencapai [condition] [value] [unit].";
    const templateOnlyChannelName =
      "Kondisi [metric] pada saluran [channel_name] sudah mencapai [condition] [value] [unit].";
    const templateOnlyDoorName =
      "Kondisi [metric] pada pintu [door_name] sudah mencapai [condition] [value] [unit].";

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

    message.data.forEach((alert) => {
      let alertMessage = "";

      if (alert.channel_name && alert.door_name) {
        alertMessage = template
          .replace("[metric]", alert.metric)
          .replace("[channel_name]", alert.channel_name)
          .replace("[door_name]", alert.door_name)
          .replace("[condition]", getCondition(alert.condition_operator))
          .replace("[value]", alert.values.toFixed(2).toString())
          .replace("[unit]", alert.metric === "debit" ? "lt/dt" : "cm");
      } else if (alert.channel_name) {
        alertMessage = templateOnlyChannelName
          .replace("[metric]", alert.metric)
          .replace("[channel_name]", alert.channel_name)
          .replace("[condition]", getCondition(alert.condition_operator))
          .replace("[value]", alert.condition_value.toFixed(2).toString())
          .replace("[unit]", alert.metric === "debit" ? "lt/dt" : "cm");
      } else if (alert.door_name) {
        alertMessage = templateOnlyDoorName
          .replace("[metric]", alert.metric)
          .replace("[door_name]", alert.door_name)
          .replace("[condition]", getCondition(alert.condition_operator))
          .replace("[value]", alert.condition_value.toFixed(2).toString())
          .replace("[unit]", alert.metric === "debit" ? "lt/dt" : "cm");
      }

      if (alert.priority === "critical") {
        toast.error("Critical", {
          description: alertMessage,
        });
      } else {
        toast.warning("Warning", {
          description: alertMessage,
        });
      }
    });
  };

  useEffect(() => {
    const messageHandlers: Record<EventSubject, MessageHandler> = {
      alert: (message) => handleAlert(message as EventMessage<AlertData>),
    };

    const eventSource = new EventSource(sseUrl);

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: EventMessage = JSON.parse(event.data);
        console.log("SSE message received:", message);
        setError(null);

        const handler = messageHandlers[message.subject];
        if (handler) {
          handler(message);
        } else {
          console.warn(
            `No handler found for message subject: ${message.subject}`
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error processing message";
        console.error("Error processing SSE message:", errorMessage);
        setError(errorMessage);
      }
    };

    eventSource.onopen = () => {
      console.log("SSE connection established");
      setConnectionStatus("connected");
      setError(null);
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      setConnectionStatus("reconnecting");
      setError("Connection lost. Attempting to reconnect...");
    };

    eventSource.onmessage = handleMessage;

    if (!auth.auth) {
      eventSource.close();
    }

    return () => {
      eventSource.close();
      setConnectionStatus("disconnected");
    };
  }, [sseUrl, auth.auth]);

  return <>{children}</>;
};

export default MessageEvent;
