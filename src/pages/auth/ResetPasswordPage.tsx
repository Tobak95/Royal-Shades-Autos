import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { CAR_IMAGES } from "@/data/carImages";
import { getApiErrorMessage } from "@/lib/api";
import type { LoginLocationState } from "@/lib/authRedirect";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators";
import { resetPassword } from "@/services/authService";
import { AuthScreen } from "./AuthScreen";
import { FormAlert } from "./FormAlert";
import { PasswordStrength } from "./PasswordStrength";

const INVALID_LINK = "This link is invalid or expired.";

/** Reached from the link in the reset email: /reset-password/:token (optionally ?email=…) */
export default function ResetPasswordPage() {
  const { token = "" } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const strengthId = useId();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, control, formState } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: params.get("email") ?? "", password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" });
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    try {
      // confirmPassword is checked here only; the backend gets email, token and newPassword
      await resetPassword(values.email.trim(), token, values.password);
      const state: LoginLocationState = { notice: "Password changed, please log in." };
      navigate("/login", { replace: true, state });
    } catch (error) {
      const notFound = axios.isAxiosError(error) && error.response?.status === 404;
      setServerError(notFound ? INVALID_LINK : getApiErrorMessage(error, "We couldn't change your password. Please try again."));
    }
  }

  return (
    <AuthScreen
      side="right"
      photo={CAR_IMAGES.lexusRx}
      eyebrow="Reset password"
      title="Choose a new *password*"
      subtitle="Use at least 8 characters. A mix of letters, numbers and symbols is safest."
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <PasswordStrength password={password} id={strengthId} />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        {serverError && (
          <FormAlert tone="error">
            {serverError}{" "}
            <Link to="/forgot-password" className="font-semibold underline">
              Request a new link
            </Link>
          </FormAlert>
        )}
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </AuthScreen>
  );
}
