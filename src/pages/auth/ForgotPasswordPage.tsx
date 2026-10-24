import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ApiErrorAlert } from "@/components/feedback/ApiErrorAlert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators";
import { forgotPassword } from "@/services/authService";
import { CAR_IMAGES } from "@/data/carImages";
import { AuthScreen } from "./AuthScreen";
import { CheckEmail } from "./CheckEmail";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<unknown>(null);
  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const { errors, isSubmitting } = formState;

  async function onSubmit({ email }: ForgotPasswordFormValues) {
    setServerError(null);
    try {
      await forgotPassword(email.trim());
      setSentTo(email.trim());
    } catch (error) {
      setServerError(error);
    }
  }

  const backToLogin = (
    <Link to="/login" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-text hover:text-gold-hover">
      <ArrowLeft aria-hidden="true" className="size-4" /> Back to log in
    </Link>
  );

  return (
    <AuthScreen
      side="right"
      photo={CAR_IMAGES.sonataGrey}
      eyebrow="Forgot password"
      title="Reset your *password*"
      subtitle="Enter the email you signed up with and we'll send you a link to choose a new password."
    >
      {sentTo ? (
        <>
          <CheckEmail
            email={sentTo}
            purpose="reset"
            onResend={() => forgotPassword(sentTo)}
            onBack={() => setSentTo(null)}
            backLabel="Use a different email"
          />
          {backToLogin}
        </>
      ) : (
        <>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <ApiErrorAlert error={serverError} fallback="We couldn't send the reset link. Please try again." onRetry={handleSubmit(onSubmit)} retrying={isSubmitting} />
            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
          {backToLogin}
        </>
      )}
    </AuthScreen>
  );
}
