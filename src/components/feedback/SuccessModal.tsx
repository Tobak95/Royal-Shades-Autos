import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SuccessCheckDrawing } from "@/components/illustrations";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/utils";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  /** Use {name} for the signed-in user's first name, e.g. "Congratulations, {name}!" */
  title: string;
  /** Title when nobody is signed in (or the name is unknown) */
  fallbackTitle: string;
  description: string;
  /** e.g. { label: "Reservation", value: "RSV-K2Q9TX" } */
  reference?: { label: string; value: string };
  /** First name to use when nobody is signed in yet (e.g. right after sign-up) */
  nameOverride?: string;
  actions: ReactNode;
}

/**
 * Celebration after reserving, signing up or accepting an offer: confetti dots, a gold
 * check and a personal title. The pop-in follows MotionConfig, so it's still with reduced motion.
 */
export function SuccessModal({ open, onClose, title, fallbackTitle, description, reference, nameOverride = "", actions }: SuccessModalProps) {
  const { user } = useAuth();
  const name = firstName(user?.fullName) || nameOverride;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      centered
      title={name ? title.replace("{name}", name) : fallbackTitle}
      description={description}
      icon={
        <motion.div
          initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        >
          <SuccessCheckDrawing />
        </motion.div>
      }
      footer={actions}
    >
      {reference && (
        <p className="inline-flex items-center gap-2 rounded-[10px] bg-page px-3 py-2 text-[13px]">
          <span className="text-muted">{reference.label}</span>
          <strong className="tracking-wide text-gold-text">{reference.value}</strong>
        </p>
      )}
    </Modal>
  );
}
