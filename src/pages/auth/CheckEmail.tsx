import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { EnvelopeDrawing } from "@/components/illustrations";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api";
import { maskEmail } from "@/lib/utils";

const RESEND_AFTER_SECONDS = 45;

const MAIL_APPS: { match: RegExp; label: string; url: string }[] = [
  { match: /@(gmail|googlemail)\.com$/i, label: "Open Gmail", url: "https://mail.google.com/mail/u/0/#inbox" },
  { match: /@(outlook|hotmail|live|msn)\.[a-z.]+$/i, label: "Open Outlook", url: "https://outlook.live.com/mail/0/" },
  { match: /@(yahoo|ymail)\.[a-z.]+$/i, label: "Open Yahoo Mail", url: "https://mail.yahoo.com/" },
  { match: /@(icloud|me|mac)\.com$/i, label: "Open iCloud Mail", url: "https://www.icloud.com/mail" },
];

interface CheckEmailProps {
  email: string;
  purpose: "reset" | "verify";
  onResend: () => Promise<void>;
  onBack: () => void;
  backLabel?: string;
}

/**
 * "Check your email" after forgot-password and sign-up: masked address, a button for the
 * person's mail app (Gmail, Outlook, …) and a resend link that unlocks after 45 seconds.
 */
export function CheckEmail({ email, purpose, onResend, onBack, backLabel = "Back" }: CheckEmailProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_AFTER_SECONDS);
  const [resending, setResending] = useState(false);
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const mailApp = MAIL_APPS.find((app) => app.match.test(email));
  const masked = maskEmail(email);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function resend() {
    setResending(true);
    setNote(null);
    try {
      await onResend();
      setNote({ tone: "ok", text: "Sent again. It can take a minute to arrive." });
      setSecondsLeft(RESEND_AFTER_SECONDS);
    } catch (error) {
      setNote({ tone: "error", text: getApiErrorMessage(error, "We couldn't resend the email. Please try again in a minute.") });
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col items-start">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> {backLabel}
      </button>
      <div className="mt-3">
        <EnvelopeDrawing />
      </div>
      <h2 className="mt-3.5 text-2xl font-extrabold tracking-[-0.02em]">Check your email</h2>
      <p role="status" className="mt-1.5 text-sm leading-relaxed text-muted">
        {purpose === "reset" ? (
          <>
            If there's an account for <strong className="text-ink">{masked}</strong>, a reset link is on its way.
          </>
        ) : (
          <>
            We sent a verification link to <strong className="text-ink">{masked}</strong>. Click it to activate your account.
          </>
        )}{" "}
        Check Spam if it's not there in a minute.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {mailApp && (
          <a
            href={mailApp.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-control bg-navy px-4 text-sm font-bold text-white transition-colors hover:bg-navy-3"
          >
            {mailApp.label} <ExternalLink aria-hidden="true" className="size-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {secondsLeft > 0 ? (
          <p className="text-[13px] text-faint" aria-live="off">
            Resend in 0:{String(secondsLeft).padStart(2, "0")}
          </p>
        ) : (
          <Button variant="ghost" size="sm" loading={resending} onClick={resend} className="text-gold-text hover:text-gold-hover">
            Resend email
          </Button>
        )}
      </div>
      {note && (
        <p role={note.tone === "error" ? "alert" : "status"} className={note.tone === "error" ? "mt-3 text-sm text-sold" : "mt-3 text-sm text-available-text"}>
          {note.text}
        </p>
      )}
    </div>
  );
}
