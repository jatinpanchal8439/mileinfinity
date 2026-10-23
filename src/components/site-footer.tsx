import { Link } from "@tanstack/react-router";
import { Gem, Leaf, Heart, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Gem className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-display text-xl uppercase tracking-[0.18em]">Mile Infinity</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Formulated botanical-inspired skincare, designed to bring intention to everyday care.
            </p>
          </div>
          <div>
            <p className="eyebrow text-primary-foreground/60">Shop</p>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/shop" className="hover:text-primary-foreground">Face Wash</Link></li>
              <li><Link to="/shop?category=serum" className="hover:text-primary-foreground">Serums</Link></li>
              <li><Link to="/shop?category=moisturizer" className="hover:text-primary-foreground">Moisturizers</Link></li>
              <li><Link to="/shop?category=sunscreen" className="hover:text-primary-foreground">Sun Care</Link></li>
              <li><Link to="/cart" className="hover:text-primary-foreground">Your Bag</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-primary-foreground/60">Help</p>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li><a href="/#faq" className="hover:text-primary-foreground">FAQ</a></li>
              <li><a href="/#faq" className="hover:text-primary-foreground">Shipping</a></li>
              <li><a href="/#faq" className="hover:text-primary-foreground">Returns</a></li>
              <li><a href="/#faq" className="hover:text-primary-foreground">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-primary-foreground/60">Notes on skincare</p>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Rituals, botanicals and intentional care.
            </p>
            <form className="mt-4 flex items-center gap-2 border-b border-primary-foreground/30 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none"
              />
              <button type="submit" className="text-primary-foreground/80 hover:text-primary-foreground" aria-label="Subscribe">
                &#8594;
              </button>
            </form>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Mile Infinity. All rights reserved.</span>
          <span className="flex items-center gap-6">
            <Leaf className="h-4 w-4" strokeWidth={1.5} />
            <Heart className="h-4 w-4" strokeWidth={1.5} />
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </footer>
  );
}
