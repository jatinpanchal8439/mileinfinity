import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X, Gem } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const NAV_LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "Serums", to: "/shop?category=serum" },
  { label: "Moisturizers", to: "/shop?category=moisturizer" },
  { label: "Sun Care", to: "/shop?category=sunscreen" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          className="text-foreground lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 text-primary">
          <Gem className="h-5 w-5" strokeWidth={1.5} />
          <span className="font-display text-xl tracking-[0.18em] uppercase">Mile Infinity</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/shop" className="hidden text-foreground transition-colors hover:text-primary sm:block" aria-label="Search products">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <Link to="/auth" className="text-foreground transition-colors hover:text-primary" aria-label="Account">
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="relative text-foreground transition-colors hover:text-primary" aria-label="Shopping bag">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link to="/shop" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">
            Shop Now
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block py-2.5 text-sm uppercase tracking-[0.16em] text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
