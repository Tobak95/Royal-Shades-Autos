import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { getRedirectPath, loginNotice, sessionExpired } from "@/lib/authRedirect";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { login as loginRequest } from "@/services/authService";
import { AuthScreen } from "./AuthScreen";
import { FormAlert } from "./FormAlert";

export default function LoginPage() {
  // All hooks run before any early return (the old page broke this rule)
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });
  const { errors, isSubmitting } = formState;
  const redirectTo = getRedirectPath(location.state);
  const cameFromProtectedPage = redirectTo !== "/";
  const notice = loginNotice(location.state);

  if (auth.isAuthenticated) return <Navigate to={redirectTo} replace />;

  // DEV ONLY: signs in as a local admin so the mock-data dashboard can be tried without the backend
  function loginAsDemoAdmin() {
    auth.login(
      "demo-admin-token",
      {
        id: "demo-admin",
        fullName: "Demo Admin",
        email: "admin@demo.local",
        phoneNumber: "",
        role: "admin",
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      false,
    );
    navigate("/admin", { replace: true });
  }

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const { token, user } = await loginRequest(values.email.trim(), values.password);
      auth.login(token, user, values.remember);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Incorrect email or password."));
    }
  }

  return (
    <AuthScreen
      side="right"
      eyebrow="Welcome back"
      title="Log in to your *Garage*"
      subtitle={
        <>
          Don't have an account?{" "}
          <Link to="/register" state={location.state} className="font-semibold text-gold-text hover:text-gold-hover">
            Create one
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
        {notice ? (
          <FormAlert tone="info">{notice}</FormAlert>
        ) : sessionExpired(location.state) ? (
          <FormAlert tone="info">Your session has expired. Please log in again.</FormAlert>
        ) : (
          cameFromProtectedPage && <FormAlert tone="info">Please log in to continue.</FormAlert>
        )}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
          labelAction={
            <Link to="/forgot-password" className="text-[13px] text-gold-text hover:text-gold-hover">
              Forgot password?
            </Link>
          }
        />
        <Checkbox label="Keep me signed in" {...register("remember")} />
        {serverError && <FormAlert tone="error">{serverError}</FormAlert>}
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
        {import.meta.env.DEV && (
          <Button variant="outline" fullWidth onClick={loginAsDemoAdmin}>
            Log in as demo admin <span className="text-xs font-semibold text-muted">(dev only)</span>
          </Button>
        )}
      </form>

      <p className="mt-[26px] flex items-center gap-3 border-t border-line pt-5 text-[13px] text-muted">
        <ShieldCheck aria-hidden="true" className="size-[18px] flex-none text-gold-text" strokeWidth={1.8} />
        Log in to see your reservations and track your cars.
      </p>
    </AuthScreen>
  );
}
