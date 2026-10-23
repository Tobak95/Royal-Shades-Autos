import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastContext, type ToastContextValue, type ToastOptions, type ToastTone } from "./ToastContext";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
}

const ICONS = { success: CircleCheck, info: Info, error: CircleAlert };
const ICON_COLORS = { success: "text-gold", info: "text-incoming-text", error: "text-sold-text" };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const showToast = useCallback((message: string, { tone = "success", duration = 3000 }: ToastOptions = {}) => {
    const id = ++nextId.current;
    // Keep at most three on screen
    setToasts((list) => [...list.slice(-2), { id, message, tone, duration }]);
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
  const Icon = ICONS[toast.tone];

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
      className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-line bg-graphite py-3 pr-2 pl-4 text-sm shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)]"
    >
      <Icon aria-hidden="true" className={cn("size-[18px] flex-none", ICON_COLORS[toast.tone])} />
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex size-9 flex-none items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-white"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </motion.div>
  );
}
