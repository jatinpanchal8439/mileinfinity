import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import logoImg from "@/assets/mile-infinity-logo.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Skincare Journal", to: "/#ritual" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    if (count <= 0) return;
    setBadgeBump(true);
    const timer = setTimeout(() => setBadgeBump(false), 450);
    return () => clearTimeout(timer);
  }, [count]);

  const routerState = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      hash: s.location.hash,
    }),
  });

  const pathname = routerState.pathname;
  const [activeHash, setActiveHash] = useState(routerState.hash || "");

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  const isLinkActive = (to: string) => {
    if (to === "/") {
      return (
        pathname === "/" &&
        (!activeHash || activeHash === "" || activeHash === "#")
      );
    }
    if (to === "/shop") {
      return pathname.startsWith("/shop") || pathname.startsWith("/product");
    }
    if (to === "/about") {
      return pathname.startsWith("/about");
    }
    if (to === "/contact") {
      return pathname.startsWith("/contact");
    }
    if (to === "/#approach") {
      return pathname === "/" && activeHash === "#approach";
    }
    if (to === "/#ritual") {
      return pathname === "/" && activeHash === "#ritual";
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5dfd5]/60 bg-[#f7f4ee]/92 backdrop-blur-md transition-all">
      <div className="relative mx-auto flex h-20 max-w-[1760px] 2xl:max-w-none items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16">
        <button
          className="p-1 text-[#162e21] lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Brand Logo on the left */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform hover:opacity-95 shrink-0"
        >
          <img
            src={logoImg}
            alt="Mile Infinity"
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Center Nav Links - Positioned in the exact center with active underline */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.to);
            return (
              <a
                key={link.label}
                href={link.to}
                onClick={() => {
                  if (link.to.includes("#")) {
                    const hashPart = link.to.substring(link.to.indexOf("#"));
                    setActiveHash(hashPart);
                  } else {
                    setActiveHash("");
                  }
                }}
                className={`relative py-1 text-[13px] tracking-[0.04em] transition-colors duration-200 group ${
                  active
                    ? "text-[#162e21] font-medium"
                    : "text-[#2c3d33]/80 hover:text-[#162e21]"
                }`}
              >
                <span>{link.label}</span>

                {/* Active Underline matching user screenshot */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#162e21] transition-all duration-300"
                  />
                )}

                {/* Subtle hover indicator for non-active links */}
                {!active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#162e21]/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Icons and rectangular SHOP SKINCARE CTA on the right */}
        <div className="flex items-center gap-5 sm:gap-6 ml-auto">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <div className="flex items-center gap-2 rounded-full border border-[#162e21]/30 bg-white/90 px-3 py-1 shadow-sm">
                <Search className="h-4 w-4 text-[#162e21]" />
                <input
                  type="text"
                  placeholder="Search skincare..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-36 bg-transparent text-xs text-[#162e21] placeholder:text-[#162e21]/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#162e21]/50 hover:text-[#162e21]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-[#162e21] transition-transform hover:scale-110"
                aria-label="Search products"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
            )}
          </div>


          <button
            type="button"
            onClick={openCart}
            className="relative text-[#162e21] transition-transform hover:scale-110 active:scale-95"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span
                className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#162e21] px-1 text-[10px] font-semibold text-white shadow-sm ${
                  badgeBump ? "animate-badge-pop" : ""
                }`}
              >
                {count}
              </span>
            )}
          </button>

          {/* Rectangular solid dark green button matching screenshot */}
          <Link
            to="/shop"
            className="btn-shimmer hover-lift-sm hidden sm:inline-flex items-center justify-center rounded-none bg-[#163729] hover:bg-[#0f261c] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Shop Skincare
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[#e5dfd5] bg-[#f7f5f0] px-6 py-5 lg:hidden">
          <div className="space-y-3">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <a
                  key={link.label}
                  href={link.to}
                  className={`block py-2 text-sm font-medium tracking-[0.06em] transition-colors ${
                    active
                      ? "text-[#162e21] font-semibold border-b-2 border-[#162e21] w-fit"
                      : "text-[#2c3d33]"
                  }`}
                  onClick={() => {
                    setMobileOpen(false);
                    if (link.to.includes("#")) {
                      setActiveHash(link.to.substring(link.to.indexOf("#")));
                    } else {
                      setActiveHash("");
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="mt-5 border-t border-[#e5dfd5] pt-4">
            <Link
              to="/shop"
              className="inline-block w-full rounded-none bg-[#162e21] py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white"
              onClick={() => setMobileOpen(false)}
            >
              Shop Skincare
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
