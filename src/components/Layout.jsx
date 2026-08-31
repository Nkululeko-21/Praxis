import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo, LogoResponsive, ButtonLink, TextLink } from './ui';
import { EMAIL, WHATSAPP_DISPLAY, whatsappLink, mailtoLink, MESSAGES, LOCATION } from '../lib/contact';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
];

/* ------------------------------------------------------------------
   Header. The audit is the primary conversion path, so its button is
   present on every page at every width — it never collapses into the
   mobile menu.
------------------------------------------------------------------- */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open ? 'bg-charcoal/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className={scrolled || open ? 'border-b border-[color:var(--hair)]' : ''}>
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center text-warm" aria-label="Praxis, home">
            <LogoResponsive height={46} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `t-small transition-colors duration-150 ${
                    isActive ? 'text-warm' : 'text-quiet hover:text-warm'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink to="/audit" className="px-4 sm:px-6">Get an audit</ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center border border-[color:var(--hair-strong)] rounded-[3px] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {/* §15 — 24px grid, 1.5px stroke, square caps, never filled */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {open ? (
                  <>
                    <path d="M5 5L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    <path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                  </>
                ) : (
                  <>
                    <path d="M4 8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    <path d="M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-b border-[color:var(--hair)] bg-charcoal lg:hidden">
          <nav className="shell py-2" aria-label="Primary, mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block hairline py-4 t-h3 first:border-t-0 ${isActive ? 'text-warm' : 'text-quiet'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={whatsappLink(MESSAGES.general)}
              target="_blank"
              rel="noreferrer noopener"
              className="block hairline py-4 t-h3 text-quiet"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------
   Footer. §12 permits the oxblood band once per page, and this is it —
   the only full-bleed use of the accent anywhere on the site.
------------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="mt-px">
      <div className="bg-oxblood text-warm">
        <div className="shell py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Logo height={58} />
              <p className="t-body measure mt-8 text-warm/80">
                Praxis builds automation, reporting and AI workflows for businesses in
                Eswatini and the region. If the work repeats, it can usually be handed
                to a system.
              </p>
            </div>

            <div className="lg:col-span-3 lg:col-start-7">
              <h2 className="t-label text-warm/60">Contact</h2>
              <ul className="mt-5 space-y-3 t-small">
                <li>
                  <a
                    href={whatsappLink(MESSAGES.general)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline underline-offset-[3px] decoration-warm/30 hover:decoration-warm"
                  >
                    WhatsApp {WHATSAPP_DISPLAY}
                  </a>
                </li>
                <li>
                  <a
                    href={mailtoLink('Automation enquiry')}
                    className="underline underline-offset-[3px] decoration-warm/30 hover:decoration-warm break-all"
                  >
                    {EMAIL}
                  </a>
                </li>
                <li className="text-warm/70">{LOCATION}</li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h2 className="t-label text-warm/60">Pages</h2>
              <ul className="mt-5 space-y-3 t-small">
                {[...NAV, { to: '/audit', label: 'Automation audit' }].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="underline underline-offset-[3px] decoration-warm/30 hover:decoration-warm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* the double rule, closing the page the way it closes the mark */}
          <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="t-caption text-warm/60">
              © {new Date().getFullYear()} Praxis. Registered in Eswatini.
            </p>
            <p className="t-caption text-warm/60">Precision through simplicity.</p>
          </div>
          <div className="mt-6" aria-hidden="true">
            <div className="h-px w-full bg-warm/45" />
            <div className="mt-[3px] h-px w-full bg-warm/45" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Route changes start at the top. Without this the router preserves the
   previous scroll offset and a new page opens halfway down. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-warm focus:px-4 focus:py-2 focus:text-charcoal"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
