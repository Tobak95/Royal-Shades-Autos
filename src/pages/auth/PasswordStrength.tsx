import { cn } from "@/lib/utils";

const LEVELS = [
  { label: "Too short", tip: "Use at least 8 characters." },
  { label: "Weak", tip: "Add capital letters, numbers or symbols." },
  { label: "Fair", tip: "Add a number or symbol." },
  { label: "Good", tip: "A little longer makes it even safer." },
  { label: "Strong", tip: "Great password." },
];

/** 0–4: one point each for length ≥ 8, mixed case, a number, a symbol (length ≥ 12 makes up for one missing) */
function scorePassword(password: string): number {
  if (password.length < 8) return 0;
  const checks = [/[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];
  const passed = checks.filter(Boolean).length + (password.length >= 12 ? 1 : 0);
  return Math.min(4, 1 + passed);
}

export function PasswordStrength({ password, id }: { password: string; id: string }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = LEVELS[score];

  return (
    <div className="flex flex-col gap-1.5">
      <div aria-hidden="true" className="flex gap-1.5">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={cn(
              "h-1 flex-1 rounded transition-colors",
              bar <= score ? (score <= 1 ? "bg-sold" : "bg-gold") : "bg-line",
            )}
          />
        ))}
      </div>
      <p id={id} aria-live="polite" className="text-xs text-muted">
        Password strength:{" "}
        <strong className={cn("font-semibold", score <= 1 ? "text-sold-text" : "text-gold")}>{level.label}</strong>.{" "}
        {level.tip}
      </p>
    </div>
  );
}
