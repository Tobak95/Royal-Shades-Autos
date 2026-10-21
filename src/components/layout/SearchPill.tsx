import { useId, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchPillProps {
  className?: string;
  /** Called after a search is submitted (e.g. to close the mobile menu) */
  onSearch?: () => void;
}

export function SearchPill({ className, onSearch }: SearchPillProps) {
  const inputId = useId();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/cars?q=${encodeURIComponent(q)}` : "/cars");
    onSearch?.();
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full border border-line bg-graphite-2 px-3.5 transition-[border-color,box-shadow]",
          "focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgb(222_187_110/0.18)]",
        )}
      >
        <Search aria-hidden="true" className="size-4 flex-none text-muted" strokeWidth={2} />
        <span className="sr-only">Search cars</span>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search make, model, VIN"
          className="w-full min-w-0 bg-transparent text-[13px] text-white placeholder:text-muted focus:outline-none"
        />
      </label>
    </form>
  );
}
