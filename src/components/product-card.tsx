import { Link } from "@tanstack/react-router";
import { Plus, Check, Zap, CreditCard, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import type { ProductDto } from "@/lib/store.functions";
import { RazorpayCheckoutModal } from "@/components/razorpay-checkout-modal";
import { getRazorpaySettings, type RazorpaySettings, type StoredOrder } from "@/lib/razorpay";
import { gsap } from "@/lib/gsap";

interface ProductCardProps {
  product: ProductDto;
  onRazorpaySuccess?: (order: StoredOrder) => void;
  showQuickPay?: boolean;
}

export function ProductCard({
  product,
  onRazorpaySuccess,
  showQuickPay = true,
}: ProductCardProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [settings, setSettings] = useState<RazorpaySettings>(getRazorpaySettings());
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(getRazorpaySettings());
    };
    window.addEventListener("mile-infinity-razorpay-settings-updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("mile-infinity-razorpay-settings-updated", handleSettingsUpdate);
    };
  }, []);

  // GSAP micro-interaction on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof window === "undefined") return;

    const onEnter = () => gsap.to(card, { y: -6, duration: 0.35, ease: "power2.out" });
    const onLeave = () => gsap.to(card, { y: 0, duration: 0.35, ease: "power2.out" });

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: product.sizes[0] ?? "30ml",
      priceInr: product.priceInr,
      imageUrl: product.imageUrl,
    });
    setAdded(true);

    // GSAP physical button feedback
    if (cardRef.current && typeof window !== "undefined") {
      gsap.fromTo(cardRef.current, { scale: 0.98 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
    }
    setTimeout(() => setAdded(false), 1600);
  }

  // Determine button styling based on Razorpay integration settings
  const getRazorpayButtonStyle = () => {
    switch (settings.buttonStyle) {
      case "razorpay":
        return "bg-[#0c2340] hover:bg-[#143763] text-white border border-[#1a4473]";
      case "gold":
        return "bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] font-bold";
      case "minimal":
        return "bg-black/85 hover:bg-black text-white";
      case "botanical":
      default:
        return "bg-[#162e21] hover:bg-[#0c2217] text-[#f7f5ef] border border-[#2b543d]";
    }
  };

  const discountAmount =
    product.comparePriceInr && product.comparePriceInr > product.priceInr
      ? product.comparePriceInr - product.priceInr
      : null;

  return (
    <>
      <div ref={cardRef} className="group flex flex-col justify-between hover-lift-sm p-3 -m-2 rounded-xl transition-all duration-300 hover:bg-white/80 bg-white/40 border border-[#e5dfd5]/60 hover:border-[#c49838]/40 hover:shadow-lg">
        <div>
          <Link
            to="/product"
            search={{ slug: product.slug }}
            className="relative block overflow-hidden bg-sand rounded-lg"
          >
            {product.isNew && (
              <span className="eyebrow absolute left-3 top-3 z-10 rounded-full bg-background/95 backdrop-blur-sm px-3 py-1 text-primary shadow-sm animate-float-gentle">
                New Product
              </span>
            )}

            {discountAmount && (
              <span className="absolute right-3 top-3 z-10 rounded-full bg-[#c49838] text-[#0d2218] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm">
                Save {formatInr(discountAmount)}
              </span>
            )}

            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-sand font-display text-6xl text-primary/40">
                MI
              </div>
            )}
          </Link>

          <div className="mt-4 flex flex-1 flex-col">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-muted-foreground uppercase">{product.category}</span>
              {settings.enabled && settings.showBadge && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#0c2340] bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200/60 font-mono">
                  <ShieldCheck className="h-2.5 w-2.5 text-blue-600" /> Razorpay 1-Click
                </span>
              )}
            </div>

            <Link
              to="/product"
              search={{ slug: product.slug }}
              className="mt-1 font-display text-lg leading-snug text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {product.name}
            </Link>

            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground min-h-[2rem]">
              {product.tagline}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="font-display text-xl font-bold text-primary">
                {formatInr(product.priceInr)}
              </span>
              {product.comparePriceInr && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatInr(product.comparePriceInr)}
                </span>
              )}
              {product.stock <= 0 && (
                <span className="eyebrow ml-auto text-destructive">Sold Out</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Razorpay Quick-Pay + Add to Bag */}
        <div className="mt-4 pt-3 border-t border-[#ede7dc] flex flex-col gap-2">
          {settings.enabled && showQuickPay && (
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              disabled={product.stock <= 0}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${getRazorpayButtonStyle()}`}
            >
              <CreditCard className="h-3.5 w-3.5 text-[#528ff0]" />
              <span>{settings.buttonText}</span>
              <span className="text-[10px] opacity-80 font-normal">({formatInr(product.priceInr)})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-medium tracking-wider uppercase border border-[#162e21]/30 hover:border-[#162e21] hover:bg-white text-[#162e21] transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
              added ? "bg-[#1f4e37] text-white border-transparent" : "bg-white/60"
            }`}
          >
            {added ? (
              <span className="inline-flex items-center gap-1.5 animate-scale-in font-semibold">
                <Check className="h-3.5 w-3.5" /> Added to Bag
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
                Add to Bag
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Razorpay Checkout Modal for this Product */}
      <RazorpayCheckoutModal
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          priceInr: product.priceInr,
          comparePriceInr: product.comparePriceInr,
          imageUrl: product.imageUrl,
          size: product.sizes?.[0] || "100ml",
          tagline: product.tagline,
        }}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(order) => {
          if (onRazorpaySuccess) onRazorpaySuccess(order);
        }}
      />
    </>
  );
}
