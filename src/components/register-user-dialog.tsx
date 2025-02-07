import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import RegisterUserForm from "./register-user-form";
import AddIcon from "/src/assets/add.svg";


const RegisterUserDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
              <div className='flex gap-2 items-center'>
              <img
                src={AddIcon}
                alt="Add"
              />
                <span>Tambah Pengguna Baru</span>
              </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[736px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
        </DialogHeader>

        <RegisterUserForm onCloseDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default RegisterUserDialog;
