import React from 'react';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlatWorkerIllustration } from './flat-worker-illustration';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void; 
    title: string;
    description: string;
    buttonText: string;
    submitButtonText: React.ReactNode; 
    submitButtonDisabled?: boolean;
    className?: string; 
    buttonFullWidth?: boolean; 
}

const ConfirmationDialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    buttonText,
    submitButtonText, 
    submitButtonDisabled,
    className, 
    buttonFullWidth,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-[425px] ${className}`}>
                <div className="flex flex-col gap-5 items-center text-center">
                    <FlatWorkerIllustration />
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-base font-semibold">{title}</h2>
                        <p className="text-[#757575] text-sm">{description}</p>
                    </div>
                    <DialogFooter>
                        <div className={`flex flex-row gap-2 ${buttonFullWidth ? 'w-full' : ''}`}>
                            <Button variant="outline" onClick={onClose} className={buttonFullWidth ? 'w-full' : ''}>
                                {buttonText}
                            </Button>
                            <Button 
                                onClick={onSubmit}
                                disabled={submitButtonDisabled}
                                className={buttonFullWidth ? 'w-full' : ''}
                            >
                                {submitButtonText}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;