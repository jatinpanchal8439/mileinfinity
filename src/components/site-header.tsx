import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
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
  const { user, isAuthenticated, openAuthModal, openProfileDrawer } = useCustomerAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);

  // Scroll listener for dynamic navbar compaction & glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (count > 0) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 450);
      return () => clearTimeout(timer);
    }
    return undefined;
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
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ease-in-out ${
        scrolled
          ? "border-[#e5dfd5]/80 bg-[#f7f4ee]/95 backdrop-blur-xl shadow-md shadow-[#162e21]/5"
          : "border-[#e5dfd5]/60 bg-[#f7f4ee]/88 backdrop-blur-md shadow-none"
      }`}
    >
      {/* Luxury botanical shimmer hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#163729]/30 to-transparent transition-opacity duration-300" />

      <div
        className={`relative mx-auto flex max-w-[1760px] 2xl:max-w-none items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16 transition-all duration-300 ease-in-out ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Mobile menu toggle with smooth rotate animation */}
        <button
          className="p-1.5 text-[#162e21] lg:hidden rounded-lg hover:bg-black/5 transition-all duration-200 active:scale-95 cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="transition-transform duration-300">
            {mobileOpen ? (
              <X className="h-6 w-6 rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </div>
        </button>

        {/* Brand Logo on the left with luxury organic hover animation */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-all duration-300 hover:opacity-95 shrink-0"
        >
          <img
            src={logoImg}
            alt="Mile Infinity"
            className={`w-auto object-contain transition-all duration-300 ease-out group-hover:scale-105 group-hover:-rotate-1 ${
              scrolled ? "h-9 sm:h-10" : "h-10 sm:h-11"
            }`}
          />
        </Link>

        {/* Center Nav Links - Positioned with animated underline & lift */}
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
                className={`relative py-1.5 text-[13px] tracking-[0.04em] transition-all duration-200 group inline-flex flex-col items-center ${
                  active
                    ? "text-[#162e21] font-semibold"
                    : "text-[#2c3d33]/80 hover:text-[#162e21]"
                }`}
              >
                <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                  {link.label}
                </span>

                {/* Animated active underline with smooth expansion from center */}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#162e21] rounded-full transition-all duration-300 shadow-xs"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#162e21]/50 rounded-full transition-all duration-300 ease-out group-hover:w-full"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Icons and rectangular SHOP SKINCARE CTA on the right */}
        <div className="flex items-center gap-4 sm:gap-5 ml-auto">
          {/* Animated expandable search bar */}
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <div className="flex items-center gap-2 rounded-full border border-[#162e21]/30 bg-white/95 px-3 py-1 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <Search className="h-4 w-4 text-[#162e21]" />
                <input
                  type="text"
                  placeholder="Search skincare..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-36 sm:w-44 bg-transparent text-xs text-[#162e21] placeholder:text-[#162e21]/50 focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#162e21]/50 hover:text-[#162e21] transition-transform duration-200 hover:rotate-90 p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-[#162e21] p-1.5 rounded-full hover:bg-black/5 transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
                aria-label="Search products"
              >
                <Search className="h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-12" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Customer Profile / Sign In Button with hover bounce and glow */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={openProfileDrawer}
              className="flex items-center gap-1.5 text-[#162e21] hover:text-[#0f261c] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer py-1 px-2.5 rounded-full hover:bg-[#163729]/5 border border-transparent hover:border-[#163729]/20 group"
              title="My Account & Orders"
            >
              <div className="w-7 h-7 rounded-full bg-[#163729] text-white flex items-center justify-center text-xs font-bold font-serif shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#163729]/30">
                {user?.name?.[0]?.toUpperCase() || "M"}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-800 transition-colors group-hover:text-[#163729]">
                {user?.name?.split(" ")[0]}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 text-[#162e21] hover:text-[#0f261c] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer py-1.5 px-3 rounded-full border border-[#162e21]/30 hover:border-[#162e21]/70 hover:bg-[#162e21]/5 text-xs font-semibold shadow-2xs hover:shadow-xs group"
              title="Sign In / Register with Free OTP"
            >
              <User className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Shopping Bag with wiggle hover animation & badge pop */}
          <button
            type="button"
            onClick={openCart}
            className="relative text-[#162e21] p-1.5 rounded-full hover:bg-black/5 transition-all duration-200 hover:scale-110 active:scale-90 group cursor-pointer"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-[19px] w-[19px] transition-transform duration-300 group-hover:-rotate-12" strokeWidth={1.5} />
            {count > 0 && (
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#162e21] px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#f7f4ee] ${
                  badgeBump ? "animate-badge-pop" : "animate-scale-in"
                }`}
              >
                {count}
              </span>
            )}
          </button>

          {/* Rectangular solid dark green button matching screenshot with shimmer sweep & hover-lift */}
          <Link
            to="/shop"
            className="btn-shimmer hover-lift-sm hidden sm:inline-flex items-center justify-center rounded-none bg-[#163729] hover:bg-[#0f261c] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:shadow-md hover:scale-102 active:scale-95 group"
          >
            <span>Shop Skincare</span>
          </Link>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileOpen && (
        <nav className="border-t border-[#e5dfd5] bg-[#f7f5f0]/98 backdrop-blur-xl px-6 py-5 lg:hidden animate-in slide-in-from-top-3 fade-in duration-300 ease-out shadow-xl">
          <div className="space-y-1.5">
            {NAV_LINKS.map((link, idx) => {
              const active = isLinkActive(link.to);
              return (
                <a
                  key={link.label}
                  href={link.to}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium tracking-[0.06em] transition-all duration-200 animate-in fade-in slide-in-from-left-2 ${
                    active
                      ? "text-[#162e21] font-semibold bg-[#162e21]/8 border-l-4 border-[#162e21]"
                      : "text-[#2c3d33] hover:bg-[#162e21]/5 hover:translate-x-1"
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
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#162e21]" />}
                </a>
              );
            })}
          </div>

          {/* Mobile Customer Auth */}
          <div className="mt-4 border-t border-[#e5dfd5] pt-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openProfileDrawer();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-emerald-50 text-sm font-semibold text-[#162e21] hover:bg-emerald-100/60 transition-colors cursor-pointer"
              >
                <span>Hi, {user?.name} (My Account)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#163729] text-white">VIP</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("login");
                }}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl border border-[#162e21]/20 hover:bg-[#162e21]/5 text-sm font-semibold text-[#162e21] transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Customer Sign In / Sign Up (Free OTP)</span>
              </button>
            )}
          </div>

          <div className="mt-4 border-t border-[#e5dfd5] pt-4">
            <Link
              to="/shop"
              className="btn-shimmer inline-block w-full rounded-none bg-[#162e21] hover:bg-[#0f261c] py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all shadow-md active:scale-98"
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
