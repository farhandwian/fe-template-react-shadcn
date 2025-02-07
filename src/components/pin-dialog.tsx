import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { InputOTP, InputOTPSlot } from "./ui/input-otp";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof schema>) => void;
  loading: boolean;
  children?: React.ReactNode;
  enableCloseButton?: boolean;
};

const schema = z.object({
  pin: z.string().min(4, "Pin must be at least 4 characters"),
});

const PinDialog = (props: Props) => {
  const { isOpen, onClose, onSubmit, loading, enableCloseButton } = props;
  const [open, setOpen] = useState(isOpen);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    onSubmit(data);
    form.reset();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent enableCloseButton={enableCloseButton}>
        <DialogHeader>
          <DialogTitle>Verifikasi Pin</DialogTitle>
          <DialogDescription>
            Tolong Masukan Pin Anda
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col items-center gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
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
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;
