import { ChangePasswordRequestSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LoginCover from "/src/assets/cover-login.svg";
import { AuthService } from "@/services/auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OTPDialog from "@/components/otp-dialog";

export const Route = createFileRoute("/change-password")({
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
  component: () => ChangePassword(),
});

function ChangePassword() {
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ChangePasswordRequestSchema>>({
    resolver: zodResolver(ChangePasswordRequestSchema),
  });

  const {
    mutate: changePasswordMutation,
    isPending: pendingChangePassword,

    isError,
  } = useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      setShowOTPDialog(true);
      form.reset();
    },
    onError: (error) => {
      toast.error("Gagal menyimpan: " + error.message);
      setError(error.message);
    },
    onSettled: () => {
      setShowOTPDialog(false);
    },
  });

  const { mutate: initiateChangePassword, isPending: pendingInitiate } =
    useMutation({
      mutationFn: AuthService.initiateChangePassword,
      onSuccess: () => {
        setShowOTPDialog(true);
      },
      onError: (error) => {
        toast.error("Gagal menyimpan: " + error.message);
      },
    });

  const submitHandler = async (
    values: z.infer<typeof ChangePasswordRequestSchema>
  ) => {
    await changePasswordMutation(values);
  };

  return (
    <div className="bg-primary-brand-600 h-screen">
      <div className="flex h-full p-10">
        <img
          src={LoginCover}
          alt="Change Password"
          className="object-cover w-full rounded-tl-3xl rounded-bl-3xl"
        />

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white rounded-tr-3xl rounded-br-3xl">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-2">Ubah Kata Sandi</h2>
            <p className="text-[#757575] mb-8">
              Silahkan masukkan kata sandi Anda.
            </p>

            {error && <div className="text-red-500">{error}</div>}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="old_password">
                        Kata Sandi Lama
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Masukkan Kata Sandi Lama"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="new_password">
                        Kata Sandi Baru
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Masukkan Kata Sandi Baru"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirm_new_password">
                        Konfirmasi Kata Sandi Baru
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Konfirmasi Kata Sandi Baru"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={async () => {
                    form.trigger();

                    if (form.formState.isValid) {
                      await initiateChangePassword({});
                    }
                  }}
                  loading={pendingInitiate}
                  disabled={pendingInitiate}
                >
                  Ubah Kata Sandi
                </Button>

                <OTPDialog
                  open={showOTPDialog}
                  setOpen={setShowOTPDialog}
                  onSubmit={(values) => {
                    form.setValue("otp", values);

                    form.handleSubmit(submitHandler)();
                  }}
                  loading={pendingChangePassword}
                  error={isError ? "Gagal mengubah kata sandi" : undefined}
                  resendOTPFn={async () => {
                    await initiateChangePassword({});
                  }}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* <OTPFormDialog
        open={showOTPDialog}
        setOpen={setShowOTPDialog}
        oldPassword={oldPassword}
        newPassword={newPassword}
      /> */}
    </div>
  );
}

export default ChangePassword;
