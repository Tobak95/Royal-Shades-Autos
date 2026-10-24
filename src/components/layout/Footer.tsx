import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { BRAND, FOOTER_COLUMNS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { FooterAccordion } from "./footer/FooterAccordion";
import { ContactList, QuickContact } from "./footer/FooterContact";
import { FooterCta } from "./footer/FooterCta";
import { SocialLinks } from "./footer/SocialLinks";

const headingClass = "text-xs font-extrabold tracking-[0.16em] text-gold-light uppercase";
const linkClass = "inline-block text-[15px] text-[#C9D2DE] transition-[color,padding] duration-200 hover:pl-1 hover:text-gold-light";

function Statement({ className }: { className?: string }) {
  return (
    <p className={cn("leading-[1.05] font-extrabold tracking-[-0.035em]", className)}>
      Drive royalty.
      <br />
      <span className="text-gold-light">Imported with care.</span>
    </p>
  );
}

/**
 * v3 footer (design-reference-v3/footer.html and footer-mobile.html): gold CTA card over the
 * top edge, big statement, link columns (an accordion on phones) and a faint wordmark.
 */
export function Footer({ showCta = true }: { showCta?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("rounded-t-[28px] bg-navy text-white md:rounded-t-hero", showCta ? "mt-24" : "mt-16 pt-12 md:pt-16")}>
      <Container>
        {showCta && <FooterCta />}

        {/* Phones */}
        <div className={cn("pb-6 md:hidden", showCta && "-mt-5")}>
          <Link to="/" aria-label={`${BRAND.shortName} home`} className="inline-block">
            <img src={logo} alt={BRAND.name} className="block h-[54px] w-auto" />
          </Link>
          <Statement className="mt-3.5 text-[32px]" />
          <QuickContact />
          <FooterAccordion />
          <SocialLinks className="mt-[22px] justify-center" />
          <p className="mt-[22px] text-center text-[13px] leading-[1.8] text-faint">
            © {year} {BRAND.name}
            <br />
            <Link to="/privacy" className="inline-flex min-h-11 items-center px-1 hover:text-gold-light">
              Privacy
            </Link>
            <span aria-hidden="true"> · </span>
            <Link to="/terms" className="inline-flex min-h-11 items-center px-1 hover:text-gold-light">
              Terms
            </Link>
          </p>
        </div>

        {/* Tablets and up */}
        <div className="hidden pb-7 md:block">
          <div className="flex flex-wrap justify-between gap-12">
            <div className="max-w-[460px] flex-[1_1_360px]">
              <Link to="/" aria-label={`${BRAND.shortName} home`} className="inline-block">
                <img src={logo} alt={BRAND.name} className="block h-[62px] w-auto" />
              </Link>
              <Statement className="mt-[22px] text-[44px]" />
              <p className="mt-4 max-w-[380px] text-[15px] leading-[1.7] text-[#AEB8C6]">
                Clean, inspected cars in Lagos. Swap the one you have, sell it fast, or import one and watch it sail home.
              </p>
              <SocialLinks className="mt-[22px]" />
            </div>

            <div className="grid flex-[2_1_600px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8">
              {FOOTER_COLUMNS.map((column) => (
                <nav key={column.heading} aria-label={column.heading}>
                  <h2 className={headingClass}>{column.heading}</h2>
                  <ul className="mt-4 flex flex-col gap-3">
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
                <h2 className={headingClass}>Visit or call</h2>
                <ContactList className="mt-4" />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-between gap-3.5 border-t border-white/10 pt-[22px] text-[13px] text-faint">
            <span>
              © {year} {BRAND.name}. All rights reserved.
            </span>
            <span className="flex flex-wrap gap-[22px]">
              <Link to="/privacy" className="hover:text-gold-light">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-gold-light">
                Terms
              </Link>
              <span>Made with care in Lagos</span>
            </span>
          </div>
        </div>
      </Container>

      {/* Oversized faint wordmark */}
      <div aria-hidden="true" className="overflow-hidden text-center leading-[0.78] font-extrabold tracking-[-0.05em] whitespace-nowrap text-gold-light/[0.08] select-none">
        <span className="text-[64px] md:hidden">ROYAL</span>
        <span className="hidden text-[min(13.5vw,168px)] md:inline">ROYAL SHADES</span>
      </div>
    </footer>
  );
}
