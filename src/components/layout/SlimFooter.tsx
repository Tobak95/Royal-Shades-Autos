import { BRAND } from "@/lib/site";
import { Container } from "./Container";

/** One-line footer used on the auth pages, as in the login and sign-up mockups */
export function SlimFooter() {
  return (
    <footer className="border-t border-section-line">
      <Container className="flex flex-wrap justify-between gap-3 py-6 text-[13px] text-subtle">
        <span>
          © {new Date().getFullYear()} {BRAND.name}
        </span>
        <span>Lagos, Nigeria</span>
      </Container>
    </footer>
  );
}
