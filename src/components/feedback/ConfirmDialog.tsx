import { useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Modal } from "@/components/ui/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Red confirm button and a bin icon */
  danger?: boolean;
  busy?: boolean;
  /**
   * A gentler alternative offered as a checkbox, e.g. "Mark as Sold instead".
   * When ticked, the confirm button switches to `confirmLabel` here.
   */
  alternative?: { label: string; confirmLabel: string };
  /** `alternative` is true when the checkbox was ticked */
  onConfirm: (alternative: boolean) => void;
  onCancel: () => void;
}

/** Ask before anything destructive, in plain words, with a safe "Keep it" default */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  danger,
  busy,
  alternative,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [useAlternative, setUseAlternative] = useState(false);
  const gentle = Boolean(alternative && useAlternative);

  function close() {
    setUseAlternative(false);
    onCancel();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="sm"
      title={title}
      icon={
        danger && (
          <span className="flex size-12 items-center justify-center rounded-[14px] bg-sold-tint text-sold">
            <Trash2 aria-hidden="true" className="size-[22px]" />
          </span>
        )
      }
      footer={
        <>
          <Button variant="outline" onClick={close}>
            {cancelLabel}
          </Button>
          <Button
            variant="navy"
            loading={busy}
            onClick={() => {
              onConfirm(gentle);
              setUseAlternative(false);
            }}
            className={danger && !gentle ? "bg-sold hover:bg-sold/85" : undefined}
          >
            {gentle && alternative ? alternative.confirmLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-muted">{description}</div>
      {alternative && (
        <Checkbox
          containerClassName="mt-3"
          checked={useAlternative}
          onChange={(e) => setUseAlternative(e.target.checked)}
          label={<span className="text-ink">{alternative.label}</span>}
        />
      )}
    </Modal>
  );
}
