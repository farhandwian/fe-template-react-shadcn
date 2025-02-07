import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Loader } from "lucide-react";
import { AuthService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "@tanstack/react-router";
import { LoginRequestSchema, LoginResponseSchema } from "@/lib/schema";
import { z } from "zod";
import { AxiosError } from "axios";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
  password: string;
}

const OTPFormDialog: React.FC<Props> = ({ open, setOpen, email, password }) => {
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Start disabled
  const [resendTimer, setResendTimer] = useState(60);
  const [isOTPFailed, setIsOTPFailed] = useState(false);
  const { setCredentials } = useAuthStore();
  const router = useRouter();

  // Start timer when component mounts
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (open) {
      // Only start timer when dialog is open
      if (isResendDisabled && resendTimer > 0) {
        interval = setInterval(() => {
          setResendTimer((prev) => prev - 1);
        }, 1000);
      } else if (resendTimer === 0) {
        setIsResendDisabled(false);
        setResendTimer(60);
      }
    }

    return () => clearInterval(interval);
  }, [isResendDisabled, resendTimer, open]);

  // Reset timer when dialog opens
  useEffect(() => {
    if (open) {
      setIsResendDisabled(true);
      setResendTimer(60);
    }
  }, [open]);

  const handleResendOTP = () => {
    setIsResendDisabled(true);
    setResendTimer(60);
    mutation.mutate({ email, password });
  };

  const otpMutation = useMutation({
    mutationFn: (otp: string) => AuthService.loginOTP({ email, otp }),
    onSuccess: async (data) => {
      try {
        setOpen(false);
        setOtp("");
        console.log(data);

        setCredentials({
          accessToken: data.data.access_token,
          refreshToken: data.data.refresh_token,
        });

        router.invalidate();
      } catch (error) {
        console.error(
          "Error fetching user data after OTP verification:",
          error
        );
        toast.error("Failed to fetch user data. Please try again.");
      }
    },
    onError: () => {
      setIsOTPFailed(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      otpMutation.mutate(otp);
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof LoginRequestSchema>) =>
      AuthService.login(values),
    onSuccess: (data) => {
      if (data.status === "success") {
        console.log({ data });
      }
    },
    onError: (error: AxiosError<z.infer<typeof LoginResponseSchema>>) => {
      const ErrorMessage = error?.response?.data.error;
      console.log(ErrorMessage || "Something went wrong");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[476px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        enableCloseButton
      >
        <DialogHeader>
          <DialogTitle>Masukkan Kode OTP</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-7">
          <div className="text-sm text-center">
            <span className="text-[#757575]">
              Silakan masukkan kode OTP yang sudah dikirimkan ke nomor WhatsApp
              anda yang terdaftar
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-full"
          >
            <InputOTP
              maxLength={6}
              onChange={(newValue: string) => setOtp(newValue)}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  className={isOTPFailed ? "border border-red-500" : ""}
                  index={0}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className={isOTPFailed ? "border border-red-500" : ""}
                  index={1}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className={isOTPFailed ? "border border-red-500" : ""}
                  index={2}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className={isOTPFailed ? "border border-red-500" : ""}
                  index={3}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className={isOTPFailed ? "border border-red-500" : ""}
                  index={4}
                />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot
                  className={isOTPFailed ? "border border-red-500" : ""}
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
            {isOTPFailed && (
              <span className="text-red-500 text-sm">Kode OTP salah</span>
            )}
            <Button type="submit" className="w-full" disabled={otp.length < 6}>
              {otpMutation.isPending ? (
                <>
                  Memverifikasi...
                  <Loader className="animate-spin" size={20} />
                </>
              ) : (
                "Verifikasi"
              )}
            </Button>
          </form>
          {!isResendDisabled ? (
            <Button variant="link" onClick={handleResendOTP}>
              Kirim Ulang Kode
            </Button>
          ) : (
            <span className="text-sm text-[#757575]">
              Kirim ulang kode dalam {resendTimer} detik
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPFormDialog;
