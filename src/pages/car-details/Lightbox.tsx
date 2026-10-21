import { useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

interface LightboxProps {
  open: boolean;
  images: string[];
  index: number;
  alt: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const navButton =
  "flex size-12 items-center justify-center rounded-full border border-white/15 bg-obsidian/70 text-white transition-colors hover:border-gold hover:text-gold";

export function Lightbox({ open, images, index, alt, onIndexChange, onClose }: LightboxProps) {
  const titleId = useId();
  const { ref, onKeyDown } = useDialog<HTMLDivElement>(open, onClose);
  const count = images.length;
  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            else if (e.key === "ArrowLeft") go(-1);
            else onKeyDown(e);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-sm focus:outline-none"
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <h2 id={titleId} className="text-sm text-muted">
              {alt} · <span className="text-white">{index + 1}</span> / {count}
            </h2>
            <button type="button" onClick={onClose} aria-label="Close gallery" className={navButton}>
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`${alt}, photo ${index + 1} of ${count}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-h-full max-w-full rounded-card object-contain"
              />
            </AnimatePresence>
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${navButton} absolute left-3 sm:left-6`}>
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${navButton} absolute right-3 sm:right-6`}>
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
