import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, Facebook } from "lucide-react";
import logoImg from "@/assets/mile-infinity-logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-[#081810] text-[#f7f5f0] border-t border-[#122e20]">
      <div className="mx-auto max-w-7xl px-4 xs:px-6 sm:px-8 py-12 xs:py-14 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block group">
              <img
                src={logoImg}
                alt="Mile Infinity"
                className="h-10 xs:h-11 sm:h-12 w-auto object-contain brightness-0 invert opacity-95 transition-opacity group-hover:opacity-100"
              />
            </Link>
            <p className="mt-3.5 sm:mt-5 text-xs leading-relaxed text-[#f7f5f0]/70 font-sans max-w-xs">
              Premium botanical-inspired skincare, designed to bring intention to everyday care.
            </p>
          </div>

          {/* Column 2: SHOP */}
          <div className="col-span-1">
            <p className="text-[10px] xs:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f7f5f0]/50">
              Shop
            </p>
            <ul className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-3 text-xs text-[#f7f5f0]/80 font-sans">
              <li><Link to="/product" className="hover:text-white transition-colors">Face Wash</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Face Serum</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Moisturiser</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Sunscreen</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Column 3: EXPLORE */}
          <div className="col-span-1">
            <p className="text-[10px] xs:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f7f5f0]/50">
              Explore
            </p>
            <ul className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-3 text-xs text-[#f7f5f0]/80 font-sans">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><a href="/#ritual" className="hover:text-white transition-colors">Skincare Journal</a></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4: HELP */}
          <div className="col-span-1">
            <p className="text-[10px] xs:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f7f5f0]/50">
              Help
            </p>
            <ul className="mt-3.5 sm:mt-5 space-y-2.5 sm:space-y-3 text-xs text-[#f7f5f0]/80 font-sans">
              <li><Link to="/contact" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: STAY IN THE RITUAL */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <p className="text-[10px] xs:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#f7f5f0]/50">
              Stay in the ritual
            </p>
            <p className="mt-3.5 sm:mt-5 font-display text-sm xs:text-base font-normal leading-snug text-[#f7f5f0]">
              Notes on skincare, botanicals and intentional care.
            </p>
            <form
              className="mt-4 sm:mt-5 flex items-center border-b border-[#f7f5f0]/30 pb-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="text-white/70 hover:text-white transition-colors pl-2 cursor-pointer"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar from Slide 5 */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[#f7f5f0]/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left text-[10px] xs:text-[11px] text-[#f7f5f0]/50 font-sans">
          <span>&copy; {new Date().getFullYear()} MILE INFINITY. ALL RIGHTS RESERVED.</span>
          <span className="tracking-[0.14em] uppercase text-[#f7f5f0]/40">
            PLANT-BASED SKINCARE &bull; INDIA
          </span>
          <div className="flex items-center gap-4 text-[#f7f5f0]/70">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
