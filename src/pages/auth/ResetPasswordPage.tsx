import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { CAR_IMAGES } from "@/data/carImages";
import { getApiErrorMessage } from "@/lib/api";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators";
import { resetPassword } from "@/services/authService";
import { AuthScreen } from "./AuthScreen";
import { FormAlert } from "./FormAlert";
import { PasswordStrength } from "./PasswordStrength";

/** Reached from the link in the reset email: /reset-password/:token */
export default function ResetPasswordPage() {
  const { token = "" } = useParams();
  const strengthId = useId();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, control, formState } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" });
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);
    try {
      await resetPassword(token, values.password, values.confirmPassword);
      setDone(true);
    } catch (error) {
      setServerError(getApiErrorMessage(error, "This reset link has expired or was already used."));
    }
  }

  return (
    <AuthScreen
      side="right"
      photo={CAR_IMAGES.lexusRx}
      eyebrow="Reset password"
      title="Choose a new *password*"
      subtitle={done ? undefined : "Use at least 8 characters. A mix of letters, numbers and symbols is safest."}
    >
      {done ? (
        <div role="status" className="mt-7 flex flex-col items-start gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-available-tint text-available">
            <CircleCheck aria-hidden="true" className="size-6" />
          </span>
          <p className="text-sm leading-relaxed text-muted">Your password has been updated. You can log in with it now.</p>
          <ButtonLink to="/login" size="lg" fullWidth className="mt-2">
            Go to log in
          </ButtonLink>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
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
      )}
    </AuthScreen>
  );
}
