import { CircleAlert, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export type SignUpResult = { ok: true; email: string } | { ok: false; message: string };

interface SignUpResultModalProps {
  result: SignUpResult | null;
  onClose: () => void;
  onGoToLogin: () => void;
}

/** Success ("check your inbox") and error modals after submitting the sign-up form */
export function SignUpResultModal({ result, onClose, onGoToLogin }: SignUpResultModalProps) {
  const iconClass = "flex size-14 items-center justify-center rounded-full";

  if (result?.ok === false) {
    return (
      <Modal
        open
        onClose={onClose}
        size="sm"
        title="We couldn't create your account"
        description={result.message}
        icon={
          <span className={`${iconClass} bg-sold/15 text-sold-text`}>
            <CircleAlert aria-hidden="true" className="size-7" />
          </span>
        }
        footer={<Button onClick={onClose}>Try again</Button>}
      />
    );
  }

  return (
    <Modal
      open={result?.ok === true}
      onClose={onClose}
      size="sm"
      title="Check your inbox"
      description={
        result?.ok
          ? `We've sent a verification link to ${result.email}. Click it to activate your account, then log in.`
          : undefined
      }
      icon={
        <span className={`${iconClass} bg-gold/15 text-gold`}>
          <MailCheck aria-hidden="true" className="size-7" />
        </span>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onGoToLogin}>Go to login</Button>
        </>
      }
    />
  );
}
