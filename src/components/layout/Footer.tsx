import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { BRAND, CONTACT, FOOTER_COLUMNS } from "@/lib/site";
import { Container } from "./Container";
import { NewsletterBand } from "./NewsletterBand";

const headingClass = "text-xs font-bold tracking-[0.16em] text-footer-heading uppercase";
// Gold focus rings are too faint on ivory, so footer links use the darker heading gold
const linkClass =
  "text-ink-link transition-colors hover:text-footer-heading focus-visible:outline-footer-heading";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10">
      <Container className="relative z-10 -mb-[90px]">
        <NewsletterBand />
      </Container>

      <div className="bg-ivory pt-[150px] pb-9 text-ink">
        <Container>
          <div className="flex flex-wrap justify-between gap-12">
            <div className="max-w-[320px] flex-[1_1_260px]">
              <Link
                to="/"
                aria-label={`${BRAND.shortName} home`}
                className="inline-block rounded-xl bg-obsidian px-3.5 py-2.5 focus-visible:outline-footer-heading"
              >
                <img src={logo} alt={BRAND.name} className="block h-[46px] w-auto" />
              </Link>
              <p className="mt-4 text-sm leading-[1.65] text-ink-soft">{BRAND.tagline}</p>
            </div>

            <div className="grid flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8">
              {FOOTER_COLUMNS.map((column) => (
                <nav key={column.heading} aria-label={column.heading}>
                  <h2 className={headingClass}>{column.heading}</h2>
                  <ul className="mt-3.5 flex flex-col gap-2.5 text-sm">
                    {column.links.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className={linkClass}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
              <div>
                <h2 className={headingClass}>Visit</h2>
                <address className="mt-3.5 flex flex-col gap-2.5 text-sm text-ink-link not-italic">
                  <span>{CONTACT.address}</span>
                  <span>{CONTACT.phone}</span>
                  <span>{CONTACT.email}</span>
                </address>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-ivory-line pt-[22px] text-[13px] text-ink-muted">
            <span>
              © {year} {BRAND.name}. All rights reserved.
            </span>
            <span>Lagos, Nigeria</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
