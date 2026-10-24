import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { signUpSchema, type SignUpFormOutput, type SignUpFormValues } from "@/lib/validators";
import { register as registerRequest } from "@/services/authService";
import { CAR_IMAGES } from "@/data/carImages";
import { AuthScreen } from "./AuthScreen";
import { PasswordStrength } from "./PasswordStrength";
import { SignUpResultModal, type SignUpResult } from "./SignUpResultModal";

export default function SignUpPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const strengthId = useId();
  const [result, setResult] = useState<SignUpResult | null>(null);
  const { register, handleSubmit, control, reset, formState } = useForm<SignUpFormValues, unknown, SignUpFormOutput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });
  const password = useWatch({ control, name: "password" });
  const { errors, isSubmitting } = formState;

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function onSubmit(values: SignUpFormOutput) {
    const email = values.email.trim();
    try {
      // Same fields the old app sent; the backend may check confirmPassword too
      await registerRequest({
        fullName: values.fullName.trim(),
        email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setResult({ ok: true, email });
      reset();
    } catch (error) {
      setResult({ ok: false, message: getApiErrorMessage(error, "We couldn't create your account. Please try again.") });
    }
  }

  return (
    <AuthScreen
      side="left"
      photo={CAR_IMAGES.gleRear}
      wide
      eyebrow="Join Royal Shades"
      title="Create your *account*"
      subtitle={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-gold-text hover:text-gold-hover">
            Log in
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" autoComplete="name" placeholder="Ayo Bello" {...register("fullName")} error={errors.fullName?.message} />
        <Input
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="+234 801 234 5678"
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
        <Button type="submit" size="lg" fullWidth loading={isSubmitting} className="sm:col-span-2">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-[18px] text-[13px] leading-relaxed text-muted">
        We'll send a verification link to your email before your first reservation.
      </p>

      <SignUpResultModal
        result={result}
        onClose={() => setResult(null)}
        onGoToLogin={() => navigate("/login", { state: location.state })}
      />
    </AuthScreen>
  );
}
