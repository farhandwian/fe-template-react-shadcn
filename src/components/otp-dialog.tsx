import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { InputOTP, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Loader } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (otp: string) => void;
  loading: boolean;
  resendOTPFn?: () => void;
  error?: string | null | undefined;
};

const schema = z.object({
  otp: z.string().min(6),
});

const OTPDialog = (props: Props) => {
  const { open, setOpen, onSubmit, loading, resendOTPFn, error } = props;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    onSubmit(values.otp);
  };

  const [resendTimer, setResendTimer] = React.useState(60);

  const [enableResendOTP, setEnableResendOTP] = React.useState(false);

  React.useEffect(() => {
    if (resendTimer === 0) {
      setEnableResendOTP(true);
      setResendTimer(60);
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resendTimer]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[476px]">
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

          {error && (
            <div className="text-sm text-center text-red-500">{error}</div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col items-center gap-4 w-full"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? (
                  <>
                    Memverifikasi...
                    <Loader className="animate-spin" size={20} />
                  </>
                ) : (
                  "Verifikasi"
                )}
              </Button>
            </form>
          </Form>
          {enableResendOTP ? (
            <Button
              variant="link"
              onClick={() => {
                if (resendOTPFn) {
                  resendOTPFn();
                  setEnableResendOTP(false);
                }
              }}
            >
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

export default OTPDialog;
