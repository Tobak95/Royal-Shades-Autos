import { useId, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const DEMO_TRACKING_NUMBERS = ["RS-24817", "RS-31055"];

const trackHref = (value: string) => `/track?number=${encodeURIComponent(value)}`;

interface TrackFormProps {
  defaultValue?: string;
  className?: string;
}

/** VIN / tracking number search. Results live on /track?number=… so they can be shared. */
export function TrackForm({ defaultValue = "", className }: TrackFormProps) {
  const inputId = useId();
  const navigate = useNavigate();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (!query) {
      setError("Enter a VIN or tracking number");
      return;
    }
    setError(null);
    navigate(trackHref(query));
  }

  return (
    <div className={className}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-wrap gap-2.5">
        <label htmlFor={inputId} className="sr-only">
          VIN or tracking number
        </label>
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter VIN or tracking number"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-[52px] min-w-0 flex-[1_1_220px] rounded-control border bg-graphite-2 px-4 text-sm text-white uppercase placeholder:text-subtle placeholder:normal-case",
            "focus:border-gold focus:shadow-[0_0_0_3px_rgb(222_187_110/0.18)] focus:outline-none",
            error ? "border-sold" : "border-line",
          )}
        />
        <Button type="submit" size="lg" className="px-6">
          Track
        </Button>
      </form>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-xs font-medium text-sold-text">
          {error}
        </p>
      )}
      <p className="mt-3 text-[13px] text-muted">
        Try a demo:{" "}
        {DEMO_TRACKING_NUMBERS.map((number, i) => (
          <span key={number}>
            {i > 0 && " · "}
            <Link to={trackHref(number)} className="text-gold hover:text-gold-light">
              {number}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
