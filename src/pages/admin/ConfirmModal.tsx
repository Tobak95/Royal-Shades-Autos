import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  /** Red button for destructive actions */
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ open, title, description, confirmLabel, danger, busy, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="navy"
            loading={busy}
            onClick={onConfirm}
            className={danger ? "bg-sold hover:bg-sold/85" : undefined}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-muted">{description}</div>
    </Modal>
  );
}
