/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterUserRequestSchema } from "@/lib/schema";
import { UserService } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InformationDialog from "./information-dialog";
import { AxiosError } from "axios";
import { getErrorMessage } from "@/lib/utils";

type Props = {
  onCloseDialog?: () => void;
};

const RegisterUserForm = ({ onCloseDialog }: Props) => {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("Berhasil!");
  const [description, setDescription] = useState(
    "Pengguna baru berhasil ditambahkan."
  );

  const form = useForm<z.infer<typeof RegisterUserRequestSchema>>({
    resolver: zodResolver(RegisterUserRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
    },
  });

  const mutation = useMutation({
    mutationFn: UserService.registerUser,
    onSuccess: (response) => {
      const userId = response.data.user_id;

      form.reset();

      if (userId) {
        handleActivateUser(userId);
      } else {
        console.error("User ID is missing. Activation failed.");
      }

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error: AxiosError) => {
      if (!error.response) return;

      const errorMessage = getErrorMessage(
        error?.response?.status,
        "create",
        "pengguna"
      );

      if (error.response.status === 403) {
        setTitle("Gagal!");
        setDescription(errorMessage);
      } else {
        setTitle("Gagal!");
        setDescription("Terjadi kesalahan saat mendaftarkan pengguna.");
      }
      setShowDialog(true);
    },
  });

  const processPhoneNumber = (phone: string): string => {
    let formattedPhone = phone.replace(/\D/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }

    if (!formattedPhone.startsWith("62")) {
      formattedPhone = "62" + formattedPhone;
    }

    return formattedPhone;
  };

  const submitHandler = (values: z.infer<typeof RegisterUserRequestSchema>) => {
    const formattedValues = {
      ...values,
      phone_number: processPhoneNumber(values.phone_number),
    };

    mutation.mutate(formattedValues);
  };

  const { mutate: activateAccountInitiate } = useMutation({
    mutationFn: UserService.activateAccountInitiate,
    onSuccess: () => {
      setTitle("Berhasil!");
      setDescription(
        "Pengguna baru berhasil di tambahkan. Silakan periksa email yang baru saja di daftarkan untuk melakukan aktivasi."
      );
      setShowDialog(true);
    },
    onError: (error) => {
      console.error("Error activating user:", error);
      setTitle("Gagal!");
      setDescription("Gagal mengirimkan email aktivasi");
      setShowDialog(true);
    },
  });

  const handleActivateUser = async (userId: string) => {
    await activateAccountInitiate({
      user_id: userId,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Masukkan Nama"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="email@email.com"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <div className="flex w-full">
                    <span className="inline-flex mr-2 items-center px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +62
                    </span>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="8xx-xxxx-xxxx"
                      className="w-[276px]"
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/\D/g, "");
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                form.reset();
                if (onCloseDialog) {
                  onCloseDialog();
                }
                setShowDialog(false);
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  Menyimpan...
                  <Loader className="animate-spin" size={20} />
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </Form>
      {showDialog && (
        <InformationDialog
          illustrationType={title === "Berhasil!" ? "success" : "failed"}
          title={title}
          description={description}
          buttonText="Selesai"
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false);
            form.reset();
            if (onCloseDialog) {
              onCloseDialog();
            }
          }}
        />
      )}
    </>
  );
};

export default RegisterUserForm;
