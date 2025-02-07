import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { SadWorkerIllustration } from "../sad-worker-illustration";
import { WorkerIllustration } from "../worker-illustration";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        toastType,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="w-full flex flex-col items-center gap-4 text-center">
              {toastType === "error" ? (
                <SadWorkerIllustration />
              ) : (
                <WorkerIllustration />
              )}

              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
