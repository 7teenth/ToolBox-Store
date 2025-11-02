import { useState } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface UseConfirmProps {
  Dialog: React.FC<ConfirmDialogProps>;
  title: string;
  description: string;
}

type PromiseHandlers = {
  resolve: (value: boolean) => void;
  reject: (reason?: unknown) => void;
};

const useConfirm = ({ Dialog, title, description }: UseConfirmProps) => {
  const [promise, setPromise] = useState<PromiseHandlers | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve, reject) => {
      setPromise({ resolve, reject });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog
      open={promise !== null}
      title={title}
      description={description}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return [ConfirmationDialog, confirm] as const;
};

export default useConfirm;
