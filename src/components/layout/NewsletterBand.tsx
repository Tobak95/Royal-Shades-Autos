import { useId, useState, type SubmitEvent } from "react";
import { CircleCheck } from "lucide-react";
import { z } from "zod";
import { AccentText } from "@/components/ui/AccentText";
import { cn } from "@/lib/utils";

const emailSchema = z.email("Enter a valid email address");

/** Overlaps the top of the ivory footer, as in the home mockup. No API yet, so it only confirms locally. */
export function NewsletterBand() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setError(null);
    setSubscribed(true);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-7 rounded-panel border border-gold/45 bg-navy px-6 py-8 sm:px-11 sm:py-10">
      <h2 className="flex-[1_1_380px] text-[26px] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance sm:text-[34px]">
        <AccentText text="Be first to know when *new arrivals* land" />
      </h2>

      {subscribed ? (
        <p role="status" className="flex flex-[0_1_360px] items-center gap-3 text-sm text-muted">
          <CircleCheck aria-hidden="true" className="size-5 flex-none text-gold-text" />
          You're on the list. We'll email you when new cars land in Lagos.
        </p>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="flex w-full flex-[0_1_360px] flex-col gap-2.5">
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "h-12 rounded-full border-2 bg-white px-5 text-sm text-navy placeholder:text-faint focus:outline-none",
              error ? "border-sold" : "border-transparent focus:border-gold",
            )}
          />
          {error && (
            <p id={`${inputId}-error`} role="alert" className="px-5 text-xs font-medium text-sold">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="h-12 rounded-full bg-gold text-sm font-bold text-navy transition-colors hover:bg-gold-light"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
