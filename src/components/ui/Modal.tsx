import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Optional icon above the title (e.g. success / error) */
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl" };

export function Modal({ open, onClose, title, description, icon, children, footer, size = "md", className }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { ref, onKeyDown } = useDialog<HTMLDivElement>(open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "relative max-h-[90vh] w-full overflow-y-auto rounded-[28px] border border-line bg-surface p-6 shadow-float focus:outline-none sm:p-8",
              SIZES[size],
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-navy/5 hover:text-gold-text"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            {icon && <div className="mb-4">{icon}</div>}
            <h2 id={titleId} className="pr-10 text-2xl font-extrabold tracking-[-0.02em]">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
            {children && <div className="mt-5">{children}</div>}
            {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
