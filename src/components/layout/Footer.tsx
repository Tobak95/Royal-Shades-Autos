import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { BRAND, CONTACT, FOOTER_COLUMNS } from "@/lib/site";
import { Container } from "./Container";

const headingClass = "text-[13px] font-bold tracking-[0.12em] text-gold-light uppercase";
const linkClass = "text-on-navy-muted transition-colors hover:text-gold-light";

/** Navy footer with a 40px top radius, as in the v2 mockups */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 rounded-t-hero bg-navy text-white">
      <Container className="pt-16 pb-[30px]">
        <div className="flex flex-wrap justify-between gap-11">
          <div className="max-w-[320px] flex-[1_1_260px]">
            <Link to="/" aria-label={`${BRAND.shortName} home`} className="inline-block">
              <img src={logo} alt={BRAND.name} className="block h-[58px] w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-[1.7] text-on-navy-muted">{BRAND.tagline}</p>
          </div>

          <div className="grid flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-[30px]">
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
              <address className="mt-3.5 flex flex-col gap-2.5 text-sm text-on-navy-muted not-italic">
                <span>{CONTACT.address}</span>
                <span>{CONTACT.phone}</span>
                <span>{CONTACT.email}</span>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-[13px] text-faint">
          <span>
            © {year} {BRAND.name}
          </span>
          <span>Lagos, Nigeria</span>
        </div>
      </Container>
    </footer>
  );
}
