import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PowerIcon } from "lucide-react";
import ChevronDownIcon from "/src/assets/chevron-down.svg";
import ChangePasswordIcon from "/src/assets/ubah-kata-sandi-navy.svg";
import ChangePINIcon from "/src/assets/ubah-pin-navy.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { AuthService } from "@/services/auth";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth-store";

const UserMenu = () => {
  const router = useRouter();
  const { removeCredentials } = useAuthStore();
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => UserService.getMe({}),
  });

  const user = data?.data?.User;

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => AuthService.logout({}),
    onSuccess: (data) => {
      if (data.status === "success") {
        removeCredentials();
        router.invalidate();
      }
    },
  });

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Button variant="ghost" className="flex gap-2">
              <div className="flex gap-4 items-center w-full">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user?.name ? user.name[0].toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span>{user?.name || "Akun"}</span>
                  <span className="text-gray-500">
                    {user?.user_access === "3"
                      ? "Administrator"
                      : "Petugas"}
                  </span>
                </div>
                <div>
                  <img src={ChevronDownIcon} alt="chevron-down" />
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="w-[210px] text-primary font-semibold"
          >
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => (window.location.href = "/change-password")}
            >
              <img
                src={ChangePasswordIcon}
                className="text-red-500"
                alt="Lock"
                width={20}
                height={20}
              />
              Ubah Kata Sandi
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => (window.location.href = "/change-pin")}
            >
              <img src={ChangePINIcon} alt="Pin" width={20} height={20} />
              Ubah PIN
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => logoutMutation()}
            >
              <PowerIcon size={16} className="text-red-500" />
              <span className="text-red-500">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default UserMenu;
