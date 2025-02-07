import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WorkerIllustration } from "./worker-illustration";
import { SadWorkerIllustration } from "./sad-worker-illustration";

export interface InformationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText: string;
  illustrationType: "success" | "failed";
}

const InformationDialog: React.FC<InformationDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  buttonText,
  illustrationType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col gap-5 items-center text-center">
          {illustrationType === "success" ? (
            <WorkerIllustration />
          ) : (
            <SadWorkerIllustration />
          )}
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-[#757575] text-sm">{description}</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>{buttonText}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InformationDialog;
