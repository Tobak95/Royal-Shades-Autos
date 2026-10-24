import { CircleAlert, RotateCcw, WifiOff } from "lucide-react";
import { getApiErrorMessage, isNetworkError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ApiErrorAlertProps {
  error: unknown;
  /** Used when the server gives no specific message */
  fallback: string;
  /** Resubmits the form; offered for network errors, where trying again usually works */
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

/**
 * Form-level error box. Network errors reassure ("your details are safe in this form") and
 * offer Try again; other errors show the specific reason.
 */
export function ApiErrorAlert({ error, fallback, onRetry, retrying, className }: ApiErrorAlertProps) {
  if (!error) return null;
  const network = isNetworkError(error);
  const Icon = network ? WifiOff : CircleAlert;

  return (
    <div role="alert" className={cn("flex gap-3 rounded-[14px] border border-[#F1C9C6] bg-sold-tint px-3.5 py-3 text-[13px] leading-[1.55] text-[#7E2A26]", className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-5 flex-none text-sold" />
      <div className="min-w-0 flex-1">
        {network ? (
          <p>
            <strong>We couldn't reach the server.</strong> Your details are safe in this form. Check your data or Wi-Fi and tap Try again.
          </p>
        ) : (
          <p>{getApiErrorMessage(error, fallback)}</p>
        )}
        {network && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="mt-1.5 -ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 font-bold text-sold hover:text-[#7E2A26] disabled:opacity-60"
          >
            <RotateCcw aria-hidden="true" className={cn("size-4", retrying && "animate-spin")} /> Try again
          </button>
        )}
      </div>
    </div>
  );
}
