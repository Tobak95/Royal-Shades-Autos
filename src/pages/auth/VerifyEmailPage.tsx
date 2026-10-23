import { useParams } from "react-router-dom";
import axios from "axios";
import { CircleCheck, CircleX } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { AccentText } from "@/components/ui/AccentText";
import { ArcLoader } from "@/components/ui/ArcLoader";
import { ButtonLink } from "@/components/ui/Button";
import { useQuery } from "@/hooks/useQuery";
import { getApiErrorMessage } from "@/lib/api";
import { verifyEmail } from "@/services/authService";
import { ResendVerificationForm } from "./ResendVerificationForm";

/** The backend may include the account's email when a token is expired, so resending is one click */
function emailFromError(error: unknown): string {
  if (axios.isAxiosError<{ email?: unknown }>(error)) {
    const email = error.response?.data?.email;
    if (typeof email === "string") return email;
  }
  return "";
}

export default function VerifyEmailPage() {
  const { token = "" } = useParams();
  const { loading, error } = useQuery(`verify-${token}`, () => verifyEmail(token));

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="glass w-full max-w-[480px] rounded-panel px-6 py-10 text-center sm:px-9">
        {loading ? (
          <>
            <ArcLoader withLogo label="Verifying your email" />
            <h1 className="mt-6 text-2xl font-extrabold">Verifying your email…</h1>
            <p className="mt-2 text-sm text-muted">This only takes a moment.</p>
          </>
        ) : error ? (
          <>
            <CircleX aria-hidden="true" className="mx-auto size-14 text-sold" strokeWidth={1.5} />
            <h1 className="mt-5 text-[28px] font-extrabold tracking-[-0.02em]">
              <AccentText text="Verification *failed*" />
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {/* No response means a network/server problem, not a bad link */}
              {axios.isAxiosError(error) && !error.response
                ? getApiErrorMessage(error)
                : "This link has expired or was already used. Enter your email and we'll send you a fresh one."}
            </p>
            <ResendVerificationForm defaultEmail={emailFromError(error)} />
          </>
        ) : (
          <>
            <CircleCheck aria-hidden="true" className="mx-auto size-14 text-gold-text" strokeWidth={1.5} />
            <h1 className="mt-5 text-[28px] font-extrabold tracking-[-0.02em]">
              <AccentText text="Email *verified*" />
            </h1>
            <p className="mt-2 text-sm text-muted">Your account is active. Log in to reserve and track your cars.</p>
            <ButtonLink to="/login" size="lg" fullWidth className="mt-7">
              Proceed to log in
            </ButtonLink>
          </>
        )}
      </div>
    </Container>
  );
}
