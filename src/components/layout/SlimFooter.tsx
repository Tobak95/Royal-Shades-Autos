import { BRAND } from "@/lib/site";
import { Container } from "./Container";

/** One-line navy footer (auth pages, and the car details / garage mockups) */
export function SlimFooter() {
  return (
    <footer className="mt-16 rounded-t-[32px] bg-navy">
      <Container className="flex flex-wrap justify-between gap-3 py-7 text-[13px] text-faint">
        <span>
          © {new Date().getFullYear()} {BRAND.name}
        </span>
        <span>Lagos, Nigeria</span>
      </Container>
    </footer>
  );
}
