/* eslint-disable react-hooks/rules-of-hooks */
import { verifyPasswordReset } from "@/actions/user";
import InformationDialog from "@/components/information-dialog";
import { resetPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LoginCover from "/src/assets/cover-login.svg";
import { useSearchParams } from "react-router-dom";

export const Route = createFileRoute("/reset-password")({
  component: () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const passwordResetToken = searchParams.get("token");
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });

    const mutation = useMutation<
      { password: string },
      Error,
      { password: string }
    >({
      mutationFn: async ({ password }) => {
        if (passwordResetToken) {
          return await verifyPasswordReset(password, passwordResetToken);
        } else {
          throw new Error("Token reset password tidak ditemukan");
        }
      },
      onSuccess: () => {
        setIsDialogOpen(true);
        form.reset();
      },
      onError: (error) => {
        toast.error("Gagal menyimpan " + error.message);
      },
    });

    const submitHandler = (values: z.infer<typeof resetPasswordSchema>) => {
      mutation.mutate({ password: values.password });
    };

    return (
      <div className="bg-primary-brand-600 h-screen">
        <div className="flex h-full p-10">
          <img
            src={LoginCover}
            alt="Reset Password"
            className="object-cover w-full rounded-tl-3xl rounded-bl-3xl"
          />

          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white rounded-tr-3xl rounded-br-3xl">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold mb-2">Reset Kata Sandi</h2>
              <p className="text-[#757575] mb-8">Silakan masukkan kata sandi</p>

              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="space-y-6"
              >
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Kata Sandi Baru
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-4 py-4 h-12 border border-[#9E9E9E] rounded-2xl bg-[#F8F9FF] focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Masukkan Kata Sandi Baru"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-primary" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <span className="text-red-500 text-sm mt-1">
                      {form.formState.errors.password.message}
                    </span>
                  )}
                </div>

                <div className="mb-10">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="w-full px-4 py-4 h-12 border border-[#9E9E9E] rounded-2xl bg-[#F8F9FF] focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Konfirmasi Kata Sandi Baru"
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-primary" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <span className="text-red-500 text-sm mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-[149px] bg-primary text-white py-4 px-4 h-12 text-sm rounded-2xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  disabled={mutation.isPending}
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
        {isDialogOpen && (
          <InformationDialog
            illustrationType="success"
            title="Berhasil!"
            description="Kata sandi anda berhasil direset. Silakan masuk kembali."
            buttonText="Masuk"
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              form.reset();
              window.location.href = "/login";
            }}
          />
        )}
      </div>
    );
  },
});
