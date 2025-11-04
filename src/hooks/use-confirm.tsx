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

type ConfirmFunctionArgs = {
  title?: string;
  description?: string;
};

const useConfirm = ({ Dialog, title, description }: UseConfirmProps) => {
  const [promise, setPromise] = useState<PromiseHandlers | null>(null);
  const [titleDialog, setTitleDialog] = useState(title);
  const [descriptionDialog, setDescriptionDialog] = useState(description);

  const confirm = ({ title, description } : ConfirmFunctionArgs = {}) => {
    if (title) setTitleDialog(title);
    if (description) setDescriptionDialog(description);

    return new Promise<boolean>((resolve, reject) => {
      setPromise({ resolve, reject });
    });
  }


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
      title={titleDialog}
      description={descriptionDialog}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return [ConfirmationDialog, confirm] as const;
};

export default useConfirm;
