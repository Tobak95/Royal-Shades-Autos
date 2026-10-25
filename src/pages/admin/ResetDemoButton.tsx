import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";
import { resetDemoData } from "@/services/adminOpsService";
import { USE_MOCK_DATA } from "@/services/mockStore";

/** Mock mode only: puts every car, reservation and change back to the seed data */
export function ResetDemoButton() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!USE_MOCK_DATA) return null;

  async function reset() {
    setBusy(true);
    await resetDemoData();
    setBusy(false);
    setOpen(false);
    showToast("Demo data reset", { tone: "info" });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-white/20 text-sm font-semibold text-white transition-colors hover:border-gold-light hover:text-gold-light"
      >
        <RotateCcw aria-hidden="true" className="size-4" /> Reset demo data
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Reset demo data?"
        description="Every car, shipment, reservation and recent change goes back to the original sample data. This only affects this browser."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="navy" loading={busy} onClick={reset}>
              Reset
            </Button>
          </>
        }
      />
    </>
  );
}
