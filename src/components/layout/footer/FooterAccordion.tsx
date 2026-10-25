import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { FOOTER_COLUMNS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ContactList } from "./FooterContact";

const SECTIONS = [
  ...FOOTER_COLUMNS.map((column) => ({ title: column.heading, links: column.links })),
  { title: "Visit us", links: null },
];

/** Phones: link groups as an accordion, one open at a time ("Cars" open first, as in the mockup) */
export function FooterAccordion() {
  const [open, setOpen] = useState<string | null>(SECTIONS[0].title);
  const baseId = useId();

  return (
    <div className="mt-5 border-t border-white/10">
      {SECTIONS.map(({ title, links }, i) => {
        const expanded = open === title;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        const Icon = expanded ? Minus : Plus;
        return (
          <div key={title} className="border-b border-white/10">
            <h2>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : title)}
                className="flex min-h-14 w-full items-center justify-between text-left text-base font-bold text-white"
              >
                {title}
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-[30px] items-center justify-center rounded-full transition-colors",
                    expanded ? "bg-gold text-navy" : "bg-white/[0.08] text-white",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={2.6} />
                </span>
              </button>
            </h2>
            {expanded && (
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="pb-3.5"
              >
                {links ? (
                  <ul className="flex flex-col">
                    {links.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className="flex min-h-11 items-center text-[15px] text-[#C9D2DE] hover:text-gold-light">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ContactList />
                )}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
