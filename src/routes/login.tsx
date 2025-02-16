/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import OTPFormDialog from "@/components/otp-form-dialog";
import { useMutation } from "@tanstack/react-query";
import InformationDialog from "@/components/information-dialog";
import LoginCover from "/src/assets/cover-login.svg";
import Logo from "/src/assets/logo-pupr.svg";
import { LoginRequestSchema } from "@/lib/schema";
import { AuthService } from "@/services/auth";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({
  component: () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showOTPDialog, setShowOTPDialog] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [message, setMessage] = useState("");

    const form = useForm<z.infer<typeof LoginRequestSchema>>({
      resolver: zodResolver(LoginRequestSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    const mutation = useMutation({
      mutationFn: (values: z.infer<typeof LoginRequestSchema>) =>
        AuthService.login(values),
      onSuccess: (data) => {
        if (data.status === "success") {
          setEmail(form.getValues("email"));
          setPassword(form.getValues("password"));
          toast.success("Login successfully, requesting OTP...");
          form.reset();

          setShowOTPDialog(true);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        setInfoDialogOpen(true);
        const ErrorMessage = error?.response?.data?.error;
        setMessage(ErrorMessage || "Something went wrong");
      },
    });

    const submitHandler = (values: z.infer<typeof LoginRequestSchema>) => {
      mutation.mutate(values);
    };

    return (

      <div className="bg-primary-brand-600 h-screen">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <div className="flex h-full items-center justify-center lg:items-stretch lg:justify-normal">
              <img
                src={LoginCover}
                alt="Login"
                className="hidden lg:block object-cover w-full rounded-tl-3xl rounded-bl-3xl"
              />

              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white rounded-3xl lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-3xl lg:rounded-br-3xl">
                <div className="w-full max-w-md">
                  <div className="my-3 space-y-2 flex flex-col items-center justify-center lg:hidden">
                    <img src={Logo} alt="Logo" className="mb-2" />
                    <div className="text-start space-y-2">
                      <h1 className="text-3xl font-bold text-primary-brand-600">
                        Command Center BBWS Citanduy
                      </h1>
                      <h3 className="text-md text-[#757575]">
                        Direktorat Jenderal Sumber Daya Air
                      </h3>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Masuk</h2>
                  <p className="text-[#757575] mb-8">
                    Silakan masukkan email dan kata sandi
                  </p>

                  <form
                    onSubmit={form.handleSubmit(submitHandler)}
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-4 h-12 border border-[#9E9E9E] rounded-2xl bg-[#F8F9FF] focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="email@email.com"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <span className="text-red-500 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-10">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-black mb-2"
                      >
                        Kata Sandi
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="w-full px-4 py-4 h-12 border border-[#9E9E9E] rounded-2xl bg-[#F8F9FF] focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Masukkan Kata Sandi"
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

                    <button
                      type="submit"
                      className="w-[149px] bg-primary text-white py-4 px-4 h-12 text-sm rounded-2xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Masuk
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </motion.div>
        </AuroraBackground>
        {showOTPDialog && (
          <OTPFormDialog
            open={showOTPDialog}
            setOpen={setShowOTPDialog}
            email={email}
            password={password}
          />
        )}

        <InformationDialog
          illustrationType="failed"
          buttonText="Coba Lagi"
          title="Gagal Masuk"
          description={message}
          isOpen={infoDialogOpen}
          onClose={() => setInfoDialogOpen(false)}
        />
      </div>
    );
  },
});
