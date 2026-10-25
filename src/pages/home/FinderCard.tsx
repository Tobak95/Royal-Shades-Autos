import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { useQuery } from "@/hooks/useQuery";
import { BODY_TYPES } from "@/lib/carOptions";
import { getFilterOptions } from "@/services/carService";

type Mode = "buy" | "swap" | "sell";

const MODES: { value: Mode; label: string }[] = [
  { value: "buy", label: "Buy a car" },
  { value: "swap", label: "Swap my car" },
  { value: "sell", label: "Sell my car" },
];

const CTA: Record<Mode, string> = { buy: "Search cars", swap: "Get swap quote", sell: "Get an offer" };

const million = 1_000_000;
const BUDGETS = [
  { value: "", label: "Any budget" },
  { value: `0-${20 * million}`, label: "Under ₦20M" },
  { value: `${20 * million}-${40 * million}`, label: "₦20M – ₦40M" },
  { value: `${40 * million}-${70 * million}`, label: "₦40M – ₦70M" },
  { value: `${70 * million}-`, label: "Above ₦70M" },
];

const thisYear = new Date().getFullYear();
const YEARS = [{ value: "", label: "Select year" }].concat(
  Array.from({ length: 22 }, (_, i) => String(thisYear - i)).map((y) => ({ value: y, label: y })),
);

/** "Buy / Swap / Sell" card overlapping the bottom of the hero */
export function FinderCard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("buy");
  const { data: options } = useQuery("filter-options", getFilterOptions);
  const makes = [{ value: "", label: "Any make" }].concat((options?.makes ?? []).map((m) => ({ value: m, label: m })));
  const bodies = [{ value: "", label: "SUV, sedan…" }].concat(BODY_TYPES.map((b) => ({ value: b, label: b })));

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    if (mode === "buy") {
      const params = new URLSearchParams();
      if (get("make")) params.set("make", get("make"));
      if (get("body")) params.set("body", get("body"));
      const [min, max] = get("budget").split("-");
      if (min && Number(min) > 0) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
      navigate(`/cars${params.size ? `?${params}` : ""}`);
      return;
    }
    // Swap and Sell are placeholder pages for now; details travel in router state, not the URL
    const details = Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));
    navigate(mode === "swap" ? "/swap" : "/sell", { state: { details } });
  }

  return (
    <section aria-label="Find, swap or sell" className="relative z-[3] -mt-24">
      <Container className="max-w-[1100px]">
        <div className="rounded-panel border border-line bg-surface px-6 pt-[22px] pb-6 shadow-float">
          <Tabs items={MODES} value={mode} onChange={setMode} label="What do you want to do?" idPrefix="finder" />
          <form
            key={mode}
            id="finder-panel"
            role="tabpanel"
            aria-labelledby={`finder-tab-${mode}`}
            onSubmit={handleSubmit}
            className="mt-[18px] grid items-end gap-3.5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
          >
            {mode === "buy" && (
              <>
                <Select label="Make" name="make" options={makes} defaultValue="" />
                <Select label="Body type" name="body" options={bodies} defaultValue="" />
                <Select label="Budget" name="budget" options={BUDGETS} defaultValue="" />
              </>
            )}
            {mode === "swap" && (
              <>
                <Input label="Your car" name="currentCar" placeholder="e.g. Toyota Camry 2015" autoComplete="off" />
                <Input label="Car you want" name="wantedCar" placeholder="Any car in stock" autoComplete="off" />
                <Input label="Your phone" name="phone" type="tel" placeholder="For the quote" autoComplete="tel" />
              </>
            )}
            {mode === "sell" && (
              <>
                <Input label="Make & model" name="makeModel" placeholder="e.g. Lexus RX 350" autoComplete="off" />
                <Select label="Year" name="year" options={YEARS} defaultValue="" />
                <Input label="Mileage" name="mileage" placeholder="Approx. km or mi" inputMode="numeric" autoComplete="off" />
              </>
            )}
            <Button type="submit" variant="navy" className="h-[50px] sm:col-span-2 lg:col-span-1 lg:px-7">
              <Search aria-hidden="true" className="size-[17px]" strokeWidth={2.2} />
              {CTA[mode]}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
