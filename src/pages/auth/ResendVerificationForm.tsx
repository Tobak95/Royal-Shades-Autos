import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getApiErrorMessage } from "@/lib/api";
import { EMAIL_INVALID } from "@/lib/validators";
import { resendVerificationEmail } from "@/services/authService";
import { FormAlert } from "./FormAlert";

const emailSchema = z.email(EMAIL_INVALID);

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ResendVerificationForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email.trim());
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    setStatus({ kind: "sending" });
    try {
      await resendVerificationEmail(parsed.data);
      setStatus({ kind: "sent" });
    } catch (error) {
      setStatus({ kind: "error", message: getApiErrorMessage(error, "We couldn't resend the email. Please try again.") });
    }
  }

  if (status.kind === "sent") {
    return (
      <FormAlert tone="info" className="mt-6 text-left">
        Email sent. Check your inbox for the new verification link.
      </FormAlert>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldError}
      />
      {status.kind === "error" && <FormAlert tone="error">{status.message}</FormAlert>}
      <Button type="submit" size="lg" fullWidth loading={status.kind === "sending"}>
        Resend verification email
      </Button>
    </form>
  );
}
