import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Info, X } from "lucide-react";
import { ShipIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ToastContext, type ToastContextValue, type ToastOptions, type ToastTone } from "./ToastContext";

interface Toast {
  id: number;
  message: string;
  detail?: string;
  tone: ToastTone;
  duration: number;
}

/** Card, icon circle and text colours per tone (design-reference-v3/human-touches.html) */
const STYLES: Record<ToastTone, { card: string; circle: string; detail: string; close: string }> = {
  success: { card: "border-l-4 border-l-available bg-surface", circle: "bg-available-tint text-available", detail: "text-muted", close: "text-muted hover:bg-navy/5 hover:text-ink" },
  warning: { card: "border-l-4 border-l-gold bg-surface", circle: "bg-gold-tint text-gold-text", detail: "text-muted", close: "text-muted hover:bg-navy/5 hover:text-ink" },
  news: { card: "bg-navy text-white", circle: "bg-gold/20 text-gold-light", detail: "text-[#C9D2DE]", close: "text-on-navy-muted hover:bg-white/10 hover:text-white" },
  error: { card: "border-l-4 border-l-sold bg-surface", circle: "bg-sold-tint text-sold", detail: "text-muted", close: "text-muted hover:bg-navy/5 hover:text-ink" },
  info: { card: "border-l-4 border-l-navy bg-surface", circle: "bg-navy/[0.06] text-navy", detail: "text-muted", close: "text-muted hover:bg-navy/5 hover:text-ink" },
};

function ToneIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") return <Check className="size-4" strokeWidth={3} />;
  if (tone === "warning") return <Clock className="size-4" strokeWidth={2.4} />;
  if (tone === "news") return <ShipIcon size={16} strokeWidth={2.2} />;
  if (tone === "error") return <span className="text-sm leading-none font-extrabold">!</span>;
  return <Info className="size-4" strokeWidth={2.4} />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const showToast = useCallback((message: string, { tone = "success", detail, duration }: ToastOptions = {}) => {
    const id = ++nextId.current;
    // Errors stay a little longer so there's time to read them; keep at most three on screen
    const ms = duration ?? (tone === "error" ? 5000 : 3000);
    setToasts((list) => [...list.slice(-2), { id, message, detail, tone, duration: ms }]);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        // Always mounted so screen readers announce new toasts
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:top-24 sm:right-6 sm:bottom-auto sm:items-end"
        >
          <AnimatePresence initial={false}>
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const style = STYLES[toast.tone];

  // onDismiss is stable, so the timer isn't restarted when other toasts appear
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl py-3 pr-2 pl-4 text-sm shadow-[0_14px_30px_-18px_rgb(11_27_46/0.45)]",
        toast.tone !== "news" && "border border-line",
        style.card,
      )}
    >
      <span aria-hidden="true" className={cn("flex size-8 flex-none items-center justify-center rounded-full", style.circle)}>
        <ToneIcon tone={toast.tone} />
      </span>
      <p className="flex-1">
        <strong className="font-bold">{toast.message}</strong>
        {toast.detail && <span className={cn("ml-1", style.detail)}>{toast.detail}</span>}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className={cn("flex size-9 flex-none items-center justify-center rounded-full transition-colors", style.close)}
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </motion.div>
  );
}
