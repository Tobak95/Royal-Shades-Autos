import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiErrorAlert } from "@/components/feedback/ApiErrorAlert";
import { SuccessModal } from "@/components/feedback/SuccessModal";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/utils";
import { signUpSchema, type SignUpFormOutput, type SignUpFormValues } from "@/lib/validators";
import { register as registerRequest, resendVerificationEmail } from "@/services/authService";
import { CAR_IMAGES } from "@/data/carImages";
import { AuthScreen } from "./AuthScreen";
import { CheckEmail } from "./CheckEmail";
import { PasswordStrength } from "./PasswordStrength";

export default function SignUpPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const strengthId = useId();
  const [serverError, setServerError] = useState<unknown>(null);
  const [signedUp, setSignedUp] = useState<{ email: string; name: string } | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const { register, handleSubmit, control, reset, formState } = useForm<SignUpFormValues, unknown, SignUpFormOutput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });
  const password = useWatch({ control, name: "password" });
  const { errors, isSubmitting } = formState;

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function onSubmit(values: SignUpFormOutput) {
    const email = values.email.trim();
    setServerError(null);
    try {
      // Same fields the old app sent; the backend may check confirmPassword too
      await registerRequest({
        fullName: values.fullName.trim(),
        email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setSignedUp({ email, name: firstName(values.fullName) });
      setWelcomeOpen(true);
      reset();
    } catch (error) {
      setServerError(error);
    }
  }

  const submit = handleSubmit(onSubmit);

  return (
    <AuthScreen
      side="left"
      photo={CAR_IMAGES.gleRear}
      wide
      eyebrow="Join Royal Shades"
      title={signedUp ? "One last *step*" : "Create your *account*"}
      subtitle={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-gold-text hover:text-gold-hover">
            Log in
          </Link>
        </>
      }
    >
      {signedUp ? (
        <CheckEmail
          email={signedUp.email}
          purpose="verify"
          onResend={() => resendVerificationEmail(signedUp.email)}
          onBack={() => navigate("/login", { state: location.state })}
          backLabel="Go to log in"
        />
      ) : (
        <>
          <form noValidate onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" autoComplete="name" placeholder="Ayo Bello" {...register("fullName")} error={errors.fullName?.message} />
            <Input
              label="Phone number"
              type="tel"
              autoComplete="tel"
              placeholder="0801 234 5678"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
              containerClassName="sm:col-span-2"
            />
            <PasswordInput
              label="Password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register("password")}
              error={errors.password?.message}
            />
            <PasswordInput
              label="Confirm password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <div className="sm:col-span-2">
              <PasswordStrength password={password} id={strengthId} />
            </div>
            <Checkbox
              containerClassName="sm:col-span-2"
              {...register("acceptTerms")}
              error={errors.acceptTerms?.message}
              label={
                <>
                  I agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-gold-text hover:text-gold-hover">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" target="_blank" className="text-gold-text hover:text-gold-hover">
                    Privacy Policy
                  </Link>
                </>
              }
            />
            <ApiErrorAlert
              error={serverError}
              fallback="We couldn't create your account. Please try again."
              onRetry={submit}
              retrying={isSubmitting}
              className="sm:col-span-2"
            />
            <Button type="submit" size="lg" fullWidth loading={isSubmitting} className="sm:col-span-2">
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-[18px] text-[13px] leading-relaxed text-muted">
            We'll send a verification link to your email before your first reservation.
          </p>
        </>
      )}

      <SuccessModal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        title="Welcome aboard, {name}!"
        fallbackTitle="Welcome aboard!"
        nameOverride={signedUp?.name}
        description="Your Royal Shades account is ready. One last step: confirm your email so you can reserve cars."
        actions={
          <Button variant="navy" onClick={() => setWelcomeOpen(false)}>
            Got it
          </Button>
        }
      />
    </AuthScreen>
  );
}
