import InformationDialog from "@/components/information-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FormAccess from "@/components/user-access-form-dialog";
import { UserService } from "@/services/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import ActivationIcon from "/src/assets/aktivasi.svg";
import AccessIcon from "/src/assets/hak-akses.svg";
import ResetIcon from "/src/assets/reset-kata-sandi.svg";
import { AxiosError } from "axios";

type Props = {
  userId: string;
};

const UserDetailsDialog = ({ userId }: Props) => {
  useEffect(() => {
    setIsOpen(userId !== undefined);
  }, [userId]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      UserService.getUser({
        id: userId,
      }),
    enabled: !!userId,
  });

  const [isOpen, setIsOpen] = useState(!!userId);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState<null | {
    title: string;
    description: string;
    type: "success" | "failed";
  }>(null);

  const {
    mutate: activateAccountInitiate,
    isPending: activateAccountInitiatePending,
  } = useMutation({
    mutationFn: UserService.activateAccountInitiate,
    onSuccess: () => {
      setResultDialog({
        title: "Email Terkirim!",
        description:
          "Aktivasi atas nama " +
          user?.data.User.name +
          " berhasil dikirimkan.",
        type: "success",
      });
      setInfoDialogOpen(true);
    },
    onError: (error) => {
      console.error("Error activating user:", error);
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 403) {
        setResultDialog({
          title: "Gagal!",
          description: "Anda tidak memiliki akses untuk melakukan aktivasi.",
          type: "failed",
        });
        setInfoDialogOpen(true);
        return;
      } else {
        setResultDialog({
          title: "Gagal!",
          description:
            "Gagal mengirimkan aktivasi untuk " + user?.data.User.name,
          type: "failed",
        });
        setInfoDialogOpen(true);
      }
    },
  });

  const handleActivateUser = async () => {
    await activateAccountInitiate({
      user_id: userId || "",
    });
  };

  const { mutate: initPasswordReset, isPending: initPasswordResetPending } =
    useMutation({
      mutationFn: UserService.initiatePasswordReset,
      onSuccess: (data) => {
        if (data.status === "success") {
          setInfoDialogOpen(true);
          setResultDialog({
            title: "Email Terkirim!",
            description:
              "Pengajuan reset kata sandi atas nama " +
              user?.data.User.name +
              " berhasil dikirimkan.",
            type: "success",
          });
        }
      },
      onError: (error) => {
        console.error("Error activating user:", error);
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 403) {
          setResultDialog({
            title: "Gagal!",
            description:
              "Anda tidak memiliki akses untuk melakukan reset kata sandi.",
            type: "failed",
          });
        } else {
          setResultDialog({
            title: "Gagal!",
            description:
              "Gagal mengirimkan pengajuan reset kata sandi untuk " +
              user?.data.User.name,
            type: "failed",
          });
        }
        setInfoDialogOpen(true);
      },
    });

  const handleResetPassword = async () => {
    await initPasswordReset({
      user_id: userId || "",
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-fit"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
          </DialogHeader>
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin" size={20} />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span>Nama</span>
                    <Input
                      value={user?.data.User?.name || "-"}
                      readOnly
                      className="w-full"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span>Email</span>
                    <Input
                      value={user?.data.User?.email || "-"}
                      type="email"
                      readOnly
                      className="w-full"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span>Nomor Telepon</span>
                  <div className="flex w-full">
                    <Input
                      value="+62"
                      type="text"
                      readOnly
                      disabled
                      className="inline-flex mr-2 items-center px-3 rounded-2xl border border-gray-300 bg-gray-50 text-gray-500 text-sm w-14"
                    />
                    <Input
                      value={user?.data.User?.phone_number?.slice(2) || ""}
                      type="tel"
                      readOnly
                      className="w-[289px]"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-10">
              <Link to="/users">
                <Button variant="outline">Kembali</Button>
              </Link>
              <Button
                variant="access"
                onClick={() => setAccessDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <img src={AccessIcon} alt="Lock" width={20} height={20} />
                <span>Hak Akses</span>
              </Button>
              {accessDialogOpen && (
                <FormAccess
                  open={accessDialogOpen}
                  onClose={() => setAccessDialogOpen(false)}
                  userId={userId}
                  userName={user?.data.User?.name || ""}
                />
              )}

              <Button
                variant="default"
                onClick={handleResetPassword}
                disabled={initPasswordResetPending}
                className="flex items-center gap-2"
              >
                <img src={ResetIcon} alt="Lock" width={20} height={20} />
                <span>Reset Kata Sandi</span>
              </Button>

              {user?.data.User?.email_verified === "0001-01-01T00:00:00Z" && (
                <Button
                  variant="activation"
                  onClick={handleActivateUser}
                  // disabled={
                  //   user?.data.User?.email_verified !== "0001-01-01T00:00:00Z" ||
                  //   activateAccountInitiatePending
                  // }
                  loading={activateAccountInitiatePending}
                  className="flex items-center gap-2"
                >
                  <img src={ActivationIcon} alt="Lock" width={20} height={20} />
                  <span>
                    {user?.data.User?.email_verified !== "0001-01-01T00:00:00Z"
                      ? "Aktif"
                      : "Aktivasi"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InformationDialog
        illustrationType={resultDialog?.type || "success"}
        isOpen={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        title={resultDialog?.title || ""}
        description={resultDialog?.description || ""}
        buttonText="Selesai"
      />
    </div>
  );
};

export default UserDetailsDialog;
