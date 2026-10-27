import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  SlidersHorizontal,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import { RazorpayCheckoutModal } from "@/components/razorpay-checkout-modal";
import { gsap } from "@/lib/gsap";
import { getDatabaseProducts, getCachedProducts, DEFAULT_SQL_PRODUCTS } from "@/lib/database-service";

// High-resolution assets matching Figma Group 24.png
import naturalGlowMatchaAdImg from "@/assets/natural-glow-matcha-ad.png";
import cardBeetrootImg from "@/assets/card-beetroot.png";
import cardGreenImg from "@/assets/card-green.png";
import cardBlueberryImg from "@/assets/product-blueberry.png";
import cardSunscreenImg from "@/assets/product-sunscreen.png";
import cinematicEmeraldBg from "@/assets/cinematic-emerald-arc-bg.png";
import sunlitForestBottlesImg from "@/assets/sunlit-forest-bottles.png";
import sereneStoneSpaBgImg from "@/assets/serene-stone-spa-bg.png";
import radiantModelsDuoBgImg from "@/assets/radiant-models-duo-bg.png";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    title: "Shop Skincare Essentials — Mile Infinity",
    meta: [
      {
        name: "description",
        content:
          "Botanical skincare, for everyday rituals. Four considered essentials for cleansing, treatment, hydration, and sun protection.",
      },
      { property: "og:title", content: "Shop — Mile Infinity Botanical Skincare" },
      {
        property: "og:description",
        content:
          "Four considered essentials for cleansing, treatment, hydration and sun protection. Find your place to begin.",
      },
    ],
  }),
});

function ShopPage() {
  return (
    <PageShell>
      {/* 1. Hero Banner: The Mile Infinity Collection */}
      <ShopHeroBanner />

      {/* 2. Shop The Essentials: 4 Products Filterable Catalog */}
      <ShopTheEssentialsSection />

      {/* 3. The Art of Pairing: Two Essentials Bundle Builder */}
      <ShopBundleBuilder />

      {/* 4. Rooted in Nature: Botanical Inspiration */}
      <ShopBotanicalInspiration />

      {/* 5. Thoughtful Care Formulation Standards Banner */}
      <ShopFormulationBanner />

      {/* 6. Good to Know: Frequently Asked Questions */}
      <ShopFaqSection />

      {/* 7. Closing Luxury CTA Banner: Your Skin. Your Ritual. */}
      <ShopClosingBanner />
    </PageShell>
  );
}

/**
 * 1. Hero Banner — Exactly matching Group 24.png Slide 1:
 * - Kicker: "THE MILE INFINITY COLLECTION"
 * - Title: "Botanical skincare, for everyday rituals." (italic serif)
 * - Description: "Four considered essentials for cleansing, treatment, hydration and sun protection. Find your place to begin."
 * - Button: "BUY NOW →" (dark green rectangle)
 */
function ShopHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f4] sm:bg-[#e8ded1]">
      <div className="relative flex flex-col sm:block min-h-0 sm:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] w-full">
        {/* Banner image: On mobile sits on top with zero obstruction; on desktop full-bleed background */}
        <div className="relative w-full h-[260px] xs:h-[320px] sm:h-full sm:absolute sm:inset-0 overflow-hidden bg-[#ded8cd]">
          <img
            src={naturalGlowMatchaAdImg}
            alt="Mile Infinity Botanical Skincare Collection"
            className="h-full w-full object-cover object-[70%_center] sm:object-center select-none"
          />
        </div>

        {/* Text placed below banner on mobile; placed on right on desktop */}
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16 w-full py-7 sm:py-16 flex items-center sm:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] bg-[#faf8f4] sm:bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full">
            {/* Clearance for model and bottle on left 7 columns on desktop */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-7 pointer-events-none" />

            {/* Content positioned in right columns */}
            <div className="lg:col-span-5 xl:col-span-5 max-w-lg lg:ml-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/75 font-sans">
                The Mile Infinity Collection
              </p>
              <h1 className="mt-2.5 sm:mt-3 font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.14] text-[#162e21]">
                Botanical skincare,<br />
                <span className="italic">for everyday rituals.</span>
              </h1>
              <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/85 font-sans max-w-sm">
                Four considered essentials for cleansing, treatment, hydration and sun protection. Find your place to begin.
              </p>
              <div className="mt-5 sm:mt-6">
                <a
                  href="#shop-catalog"
                  className="inline-flex items-center justify-center gap-3 bg-[#162e21] hover:bg-[#0c2217] text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all rounded-none shadow-md hover:gap-4 w-full sm:w-auto text-center"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 2. Shop The Essentials Product Catalog — Exactly matching Group 24.png Slide 2:
 * - Kicker: "SHOP THE ESSENTIALS"
 * - Title: "Your everyday skincare ritual."
 * - Right: "4 products"
 * - Filter bar: "Filter by", "Category: All products ▼", "Price: Any price ▼", "Clear all", "Sort by: Featured ▼"
 * - 4 Product Cards Grid:
 *     1. Face Wash: Crimson Beauty Beetroot Facewash — ₹999
 *     2. Face Serum: Ceremonial Green Fusion Serum — ₹1,599
 *     3. Moisturiser: Blue Berry & Lavender Bliss Moisturiser — ₹1,099
 *     4. Sunscreen: Sunnykiss Radiance SPF 50 Sunscreen — ₹1,299
 * - Link: "VIEW PRODUCT →"
 * - Button: "ADD TO BAG →"
 * - Centered footnote: "You're viewing all 4 essentials. A complete ritual, thoughtfully kept simple."
 */
function ShopTheEssentialsSection() {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [addedId, setAddedId] = useState<string | null>(null);
  interface ShopProductItem {
    id: string;
    slug: string;
    categoryKey: string;
    categoryTag: string;
    name: string;
    description: string;
    priceInr: number;
    size: string;
    image: string;
  }

  const [products, setProducts] = useState<ShopProductItem[]>(() =>
    getCachedProducts().map((p, idx) => ({
      id: p.id,
      slug: p.slug,
      categoryKey: p.category,
      categoryTag: p.category.toUpperCase(),
      name: p.name,
      description: p.description || p.tagline || "",
      priceInr: p.priceInr,
      size: p.sizes?.[0] || "50ml",
      image: p.imageUrl || [cardBeetrootImg, cardGreenImg, cardBlueberryImg, cardSunscreenImg][idx % 4],
    }))
  );

  const [quickPayProduct, setQuickPayProduct] = useState<ShopProductItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sync products from database on mount & on product updates
  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      try {
        const data = await getDatabaseProducts();
        if (active && data) {
          setProducts(
            data.map((p, idx) => ({
              id: p.id,
              slug: p.slug,
              categoryKey: p.category,
              categoryTag: p.category.toUpperCase(),
              name: p.name,
              description: p.description || p.tagline || "",
              priceInr: p.priceInr,
              size: p.sizes?.[0] || "50ml",
              image: p.imageUrl || [cardBeetrootImg, cardGreenImg, cardBlueberryImg, cardSunscreenImg][idx % 4],
            }))
          );
        }
      } catch {
        // Fallback silently to initial catalogue
      }
    };
    fetchCatalog();

    const handleProductsUpdated = () => fetchCatalog();
    window.addEventListener("mile-infinity-products-updated", handleProductsUpdated);
    return () => {
      active = false;
      window.removeEventListener("mile-infinity-products-updated", handleProductsUpdated);
    };
  }, []);

  // GSAP Staggered product cards entrance on filter / sort
  useEffect(() => {
    if (!gridRef.current || typeof window === "undefined") return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 28, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
    );
  }, [selectedCategory, selectedPrice, sortBy]);

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== "all" && p.categoryKey !== selectedCategory) return false;
      if (selectedPrice === "under1200" && p.priceInr >= 1200) return false;
      if (selectedPrice === "over1200" && p.priceInr < 1200) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.priceInr - b.priceInr;
      if (sortBy === "price-high") return b.priceInr - a.priceInr;
      return 0;
    });

  const handleAddToCart = (p: typeof products[0]) => {
    add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      size: p.size,
      priceInr: p.priceInr,
      imageUrl: p.image,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="shop-catalog" className="bg-[#f7f5ef] py-16 lg:py-24 border-t border-[#ede7dc]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Header row from Group 24 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#162e21]/15 pb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Shop The Essentials
            </p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#162e21] leading-tight">
              Your everyday skincare ritual.
            </h2>
          </div>
          <span className="text-xs uppercase tracking-[0.16em] font-normal text-[#162e21]/70 font-sans sm:text-right">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Filter Bar from Group 24 */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#162e21]/10 pb-5 sm:pb-6 text-xs text-[#162e21] font-sans">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-6">
            <div className="flex items-center gap-1.5 font-medium shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter by</span>
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white/90 border border-[#162e21]/20 rounded-none px-2.5 sm:px-3 py-1.5 pr-6 sm:pr-7 text-xs font-medium text-[#162e21] cursor-pointer focus:outline-none focus:border-[#162e21]"
              >
                <option value="all">Category: All</option>
                <option value="cleanser">Face Wash</option>
                <option value="serum">Face Serum</option>
                <option value="moisturiser">Moisturiser</option>
                <option value="sunscreen">Sunscreen</option>
              </select>
              <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#162e21]/60" />
            </div>

            {/* Price dropdown */}
            <div className="relative">
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="appearance-none bg-white/90 border border-[#162e21]/20 rounded-none px-2.5 sm:px-3 py-1.5 pr-6 sm:pr-7 text-xs font-medium text-[#162e21] cursor-pointer focus:outline-none focus:border-[#162e21]"
              >
                <option value="all">Price: Any</option>
                <option value="under1200">Under ₹1,200</option>
                <option value="over1200">₹1,200 &amp; Above</option>
              </select>
              <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#162e21]/60" />
            </div>

            {(selectedCategory !== "all" || selectedPrice !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedPrice("all");
                }}
                className="text-[#162e21]/70 hover:text-[#162e21] underline text-xs ml-1"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative self-start sm:self-auto sm:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/90 border border-[#162e21]/20 rounded-none px-2.5 sm:px-3 py-1.5 pr-6 sm:pr-7 text-xs font-medium text-[#162e21] cursor-pointer focus:outline-none focus:border-[#162e21]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#162e21]/60" />
          </div>
        </div>

        {/* 4 Product Cards Grid */}
        <div ref={gridRef} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch">
          {filteredProducts.map((p) => {
            const isAdded = addedId === p.id;
            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between bg-white/75 hover:bg-white p-4 transition-all duration-300 border border-[#e5dfd5]/85 hover:shadow-xl"
              >
                <div>
                  {/* Product Artwork image */}
                  <a
                    href={`/product?id=${p.id}&slug=${p.slug}`}
                    className="aspect-[4/5] overflow-hidden bg-[#faf8f4] flex items-center justify-center relative block cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>

                  {/* Product details */}
                  <div className="mt-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b7b6c] font-sans">
                      {p.categoryTag}
                    </span>
                    <h3 className="mt-1.5 font-serif text-base sm:text-[17px] font-normal text-[#162e21] leading-snug min-h-[2.75rem] line-clamp-2">
                      <a href={`/product?id=${p.id}&slug=${p.slug}`} className="hover:underline">
                        {p.name}
                      </a>
                    </h3>
                    <p className="mt-2 text-xs text-[#2c3d33]/80 leading-relaxed font-sans min-h-[2.5rem] line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#ede7dc]">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-serif text-lg font-bold text-[#162e21]">
                      {formatInr(p.priceInr)}
                    </span>
                    <a
                      href={`/product?id=${p.id}&slug=${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:underline"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`/product?id=${p.id}&slug=${p.slug}`}
                      className="w-full bg-white hover:bg-[#f7f5ef] text-[#162e21] py-2.5 px-3 text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm border-2 border-[#162e21] active:scale-95 cursor-pointer text-center"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-[#162e21]" />
                      <span>Buy Now</span>
                      <span className="text-[11px] font-normal text-[#162e21]/75">({formatInr(p.priceInr)})</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="w-full bg-[#162e21] hover:bg-[#0c2217] text-white py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm"
                    >
                      {isAdded ? (
                        <span className="inline-flex items-center gap-2 text-emerald-300">
                          <Check className="h-3.5 w-3.5" /> Added to Bag
                        </span>
                      ) : (
                        <>
                          <span>Add to Bag</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Footnote from Group 24 */}
        <p className="mt-12 text-center text-xs text-[#2c3d33]/70 font-sans italic">
          You're viewing all 4 essentials. A complete ritual, thoughtfully kept simple.
        </p>

        {/* Razorpay Direct Checkout Modal */}
        {quickPayProduct && (
          <RazorpayCheckoutModal
            product={{
              id: quickPayProduct.id,
              name: quickPayProduct.name,
              slug: quickPayProduct.slug,
              category: quickPayProduct.categoryTag,
              priceInr: quickPayProduct.priceInr,
              imageUrl: quickPayProduct.image,
              size: quickPayProduct.size,
              tagline: quickPayProduct.description,
            }}
            isOpen={!!quickPayProduct}
            onClose={() => setQuickPayProduct(null)}
          />
        )}
      </div>
    </section>
  );
}

/**
 * 3. The Art of Pairing: Two Essentials Bundle Builder — Exactly matching Group 24.png Slide 3
 */
function ShopBundleBuilder() {
  const { add } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>(["prod-1", "prod-2"]);
  const [added, setAdded] = useState(false);

  const bundleCatalog = [
    {
      id: "prod-1",
      slug: "crimson-beauty-beetroot-facewash",
      categoryStep: "01 / CLEANSE",
      stepName: "CLEANSE",
      shortName: "Beetroot",
      name: "Mile Infinity Crimson Beauty Beetroot Facewash",
      priceInr: 999,
      size: "100ml",
      cardImage: cardBeetrootImg,
    },
    {
      id: "prod-2",
      slug: "ceremonial-green-fusion-serum",
      categoryStep: "02 / TREAT",
      stepName: "TREAT",
      shortName: "Green fusion",
      name: "Mile Infinity Ceremonial Green Fusion Serum",
      priceInr: 1599,
      size: "30ml",
      cardImage: cardGreenImg,
    },
    {
      id: "prod-3",
      slug: "blueberry-lavender-bliss-moisturiser",
      categoryStep: "03 / HYDRATE",
      stepName: "HYDRATE",
      shortName: "Blueberry & Lavender",
      name: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
      priceInr: 1099,
      size: "50ml",
      cardImage: cardBlueberryImg,
    },
    {
      id: "prod-4",
      slug: "sunnykiss-radiance-spf-sunscreen",
      categoryStep: "04 / PROTECT",
      stepName: "PROTECT",
      shortName: "Radiance SPF",
      name: "Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen",
      priceInr: 1299,
      size: "100ml",
      cardImage: cardSunscreenImg,
    },
  ];

  function toggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== id);
      }
      const first = prev[0];
      if (prev.length >= 2 && first) {
        return [first, id];
      }
      return [...prev, id];
    });
    setAdded(false);
  }

  const selectedItems = bundleCatalog.filter((item) => selectedIds.includes(item.id));
  const card1 = selectedItems[0] ?? bundleCatalog[0]!;
  const card2 = selectedItems[1] ?? bundleCatalog[1]!;
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.priceInr, 0);
  const ritualTitle = selectedItems.map((i) => i.shortName).join(" + ");

  function handleAddRitual() {
    for (const item of selectedItems) {
      add({
        productId: item.id,
        slug: item.slug,
        name: item.name,
        size: item.size,
        priceInr: item.priceInr,
        imageUrl: item.cardImage,
      });
    }
    setAdded(true);
  }

  return (
    <section id="ritual" className="relative w-full overflow-hidden bg-[#0c2217] py-16 sm:py-20 lg:py-28 text-white">
      {/* Cinematic Emerald Arc Background Image */}
      <img
        src={cinematicEmeraldBg}
        alt="Cinematic Emerald Arc Abstract Background"
        className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#06170f]/35 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        {/* Top Header from Group 24 Slide 3 */}
        <div className="grid gap-5 md:grid-cols-12 md:items-end border-b border-white/15 pb-6 sm:pb-8 mb-8 sm:mb-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-8 h-[1px] bg-emerald-300/60" />
              <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-emerald-300">
                The Art of Pairing
              </p>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.08] text-white">
              Two essentials.<br />
              One personal ritual.
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-sm sm:ml-auto">
              Bring your everyday essentials together. Choose any two Mile Infinity products and
              make a little space for conscious care.
            </p>
            <p className="mt-2.5 sm:mt-3 text-[10px] font-mono tracking-[0.22em] uppercase text-emerald-300/90">
              Four essentials. Your choice of two.
            </p>
          </div>
        </div>

        {/* Dual Cards + Selector Card */}
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Visual: Two large cards with floating "+" button */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative">
            {/* Card 1 */}
            <div className="w-full sm:w-1/2 max-w-[260px] sm:max-w-[280px] overflow-hidden bg-[#f7f5f0] shadow-2xl transition-transform duration-500 hover:scale-[1.02] border border-white/20">
              <div className="aspect-[4/5] overflow-hidden bg-[#e8e4db] flex items-center justify-center">
                <img
                  src={card1.cardImage}
                  alt={card1.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[#e8e3d8] text-[#162e21]">
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase font-sans">
                  {card1.categoryStep}
                </span>
                <span className="font-serif italic text-base capitalize">
                  {card1.shortName}
                </span>
              </div>
            </div>

            {/* Floating "+" Button */}
            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f5f0] text-[#162e21] shadow-xl border border-white/60 my-[-8px] sm:my-0">
              <span className="text-xl font-light leading-none">+</span>
            </div>

            {/* Card 2 */}
            <div className="w-full sm:w-1/2 max-w-[260px] sm:max-w-[280px] overflow-hidden bg-[#f7f5f0] shadow-2xl transition-transform duration-500 hover:scale-[1.02] border border-white/20">
              <div className="aspect-[4/5] overflow-hidden bg-[#e8e4db] flex items-center justify-center">
                <img
                  src={card2.cardImage}
                  alt={card2.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[#e8e3d8] text-[#162e21]">
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase font-sans">
                  {card2.categoryStep}
                </span>
                <span className="font-serif italic text-base capitalize">
                  {card2.shortName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: "Choose your two." sand card */}
          <div className="lg:col-span-5 bg-[#f4f1ea] p-4 sm:p-6 lg:p-8 text-[#162e21] shadow-2xl border border-[#ded8cb]">
            <div className="flex items-center justify-between border-b border-[#ded8cb] pb-3.5 sm:pb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-[#162e21]">
                  Choose your two.
                </h3>
                <p className="mt-1 text-xs text-[#2c3d33]/70 font-sans">
                  Select two essentials to create your own pairing.
                </p>
              </div>
              <span className="border border-[#162e21]/40 px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.18em] text-[#162e21] shrink-0">
                2 OF 2 SELECTED
              </span>
            </div>

            <div className="mt-3.5 sm:mt-4 space-y-2">
              {bundleCatalog.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={`flex w-full items-center gap-2.5 sm:gap-3.5 p-2 sm:p-3 text-left transition-all ${
                      isSelected
                        ? "bg-[#dfe5da] ring-1 ring-[#162e21]/20 shadow-sm"
                        : "bg-transparent hover:bg-white/40"
                    }`}
                  >
                    <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden bg-white p-0.5 border border-[#ded7cb]">
                      <img
                        src={item.cardImage}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold tracking-wider uppercase text-[#162e21]/60">
                        {item.stepName}
                      </p>
                      <p className="text-xs font-serif font-medium text-[#162e21] truncate">
                        {item.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-serif text-xs sm:text-sm font-semibold text-[#162e21]">
                        {formatInr(item.priceInr)}
                      </span>
                      <div
                        className={`flex h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-[#1a382b] bg-[#1a382b] text-white"
                            : "border-[#162e21]/40 bg-transparent"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[2.5]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 sm:mt-6 border-t border-[#ded8cb] pt-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2c3d33]/60">
                    Your two-product ritual
                  </p>
                  <p className="font-serif text-lg sm:text-xl lg:text-2xl font-medium text-[#162e21] mt-0.5">
                    {ritualTitle || "Select 2 Products"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2c3d33]/60">
                    Bundled Total
                  </p>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#162e21]">
                    {formatInr(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddRitual}
                className="mt-5 w-full bg-[#162e21] hover:bg-[#0c2217] text-white py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 rounded-none shadow-md"
              >
                {added ? (
                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    <Check className="h-4 w-4" /> Added to Bag
                  </span>
                ) : (
                  <>
                    <span>Add Your Ritual to Bag</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. Botanical Inspiration / Rooted in Nature — Exactly matching Group 24.png Slide 4
 */
function ShopBotanicalInspiration() {
  return (
    <section className="bg-[#f7f5ef] py-20 lg:py-28 border-t border-[#ede7dc]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 relative overflow-hidden shadow-lg border border-[#e5dfd5]/80">
            <img
              src={sunlitForestBottlesImg}
              alt="Mile Infinity Skincare in Sunlit Forest"
              className="w-full h-auto object-cover select-none"
            />
          </div>

          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Rooted in Nature
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.15] text-[#162e21]">
              Botanical inspiration. Thoughtful<br />everyday care.
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/80 font-sans max-w-xl">
              Mile Infinity brings a botanical-inspired approach to modern skincare. A focused collection, created to bring intention to the rituals you return to each day.
            </p>

            <div className="mt-8 divide-y divide-[#162e21]/15 border-y border-[#162e21]/15">
              <div className="py-3.5 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-4 sm:items-center">
                <span className="sm:col-span-4 lg:col-span-3 font-serif text-base sm:text-lg text-[#162e21] font-normal">
                  Beetroot
                </span>
                <p className="sm:col-span-8 lg:col-span-9 text-xs sm:text-sm text-[#2c3d33]/80 font-sans leading-relaxed">
                  The inspiration behind Crimson Beauty Facewash.
                </p>
              </div>

              <div className="py-3.5 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-4 sm:items-center">
                <span className="sm:col-span-4 lg:col-span-3 font-serif text-base sm:text-lg text-[#162e21] font-normal">
                  Green tea
                </span>
                <p className="sm:col-span-8 lg:col-span-9 text-xs sm:text-sm text-[#2c3d33]/80 font-sans leading-relaxed">
                  A botanical reference for Ceremonial Green Fusion Serum.
                </p>
              </div>

              <div className="py-3.5 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-4 sm:items-center">
                <span className="sm:col-span-4 lg:col-span-3 font-serif text-base sm:text-lg text-[#162e21] font-normal">
                  Blue berry &amp; lavender
                </span>
                <p className="sm:col-span-8 lg:col-span-9 text-xs sm:text-sm text-[#2c3d33]/80 font-sans leading-relaxed">
                  The inspiration for Bliss Moisturiser.
                </p>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-[#2c3d33]/65 font-sans leading-relaxed">
              Botanical references describe inspiration. See each product's packaging for its full ingredient list.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 5. Thoughtful Care. Everyday beauty. Formulation Standards — Exactly matching Group 24.png Slide 5
 */
function ShopFormulationBanner() {
  return (
    <section className="bg-[#0e2a1e] py-12 lg:py-16 text-white border-t border-[#16382b]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Thoughtful care. Everyday beauty.
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a4c2b0]">
            The Mile Infinity Approach
          </span>
        </div>

        <div className="mt-8 pt-8 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-950/40 text-emerald-200">
              <Leaf className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white font-normal">Botanical-inspired</h4>
              <p className="mt-1.5 text-xs text-white/75 font-sans leading-relaxed">
                Plant-based skincare, inspired by the natural world.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-950/40 text-emerald-200">
              <Heart className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white font-normal">Not tested on animals</h4>
              <p className="mt-1.5 text-xs text-white/75 font-sans leading-relaxed">
                A commitment to care that extends beyond your routine.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-950/40 text-emerald-200">
              <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white font-normal">A considered ritual</h4>
              <p className="mt-1.5 text-xs text-white/75 font-sans leading-relaxed">
                Four essentials. Clear steps for thoughtful everyday care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 6. Good to Know: Frequently Asked Questions — Exactly matching Group 24.png Slide 6
 */
const FAQS = [
  {
    q: "What is Mile Infinity?",
    a: "Mile Infinity is a purpose-led botanical skincare collection. Every formula is designed to bring intention and simplicity to your everyday routine.",
  },
  {
    q: "What type of skincare products does Mile Infinity offer?",
    a: "We offer serums, moisturizers, gentle cleansers and broad-spectrum sun care — a focused selection of essentials formulated for hydration, nourishment and daily protection.",
  },
  {
    q: "How should I build a basic skincare routine?",
    a: "Begin with a cleanser, apply a treatment serum to damp skin, seal in hydration with a moisturizer, and finish with sunscreen every morning.",
  },
  {
    q: "Which Mile Infinity product should I start with?",
    a: "The Crimson Beauty Beetroot Facewash and Ceremonial Green Fusion Serum are ideal first steps suitable for all skin types.",
  },
  {
    q: "How should I use a face serum?",
    a: "Apply 3-4 drops directly to cleansed, slightly damp skin. Gently press with palms rather than rubbing to allow concentrated botanicals to absorb.",
  },
  {
    q: "When should sunscreen be applied?",
    a: "Apply Sunnykiss Radiance SPF 50 generously as the final step of your morning ritual, at least 15 minutes before stepping into natural light.",
  },
  {
    q: "Are Mile Infinity products cruelty-free?",
    a: "Yes, 100%. We never test on animals and our formulations carry certified cruelty-free and vegan ethical commitments.",
  },
  {
    q: "What ingredients are used in Mile Infinity formulations?",
    a: "We harness beetroot, Japanese green tea, white mulberry, wild blueberry, French lavender, and cold-pressed avocado, enhanced with vitamins C and E.",
  },
];

function ShopFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full overflow-hidden bg-[#faf8f4] py-20 lg:py-28 border-t border-[#ede7dc]">
      <img
        src={sereneStoneSpaBgImg}
        alt="Botanical silk and travertine still life"
        className="absolute inset-0 h-full w-full object-cover object-left lg:object-center select-none pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 pt-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[#162e21]/75 font-semibold">
              Good to know
            </p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.14] text-[#162e21]">
              Frequently asked<br />
              <span className="italic">questions.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm sm:text-base text-[#2c3d33]/85 leading-relaxed font-sans">
              Everything you need to begin a simpler Mile Infinity skincare ritual.
            </p>
          </div>

          <div className="lg:col-span-7 divide-y divide-[#162e21]/20 border-y border-[#162e21]/20 sm:bg-transparent bg-[#fdfbf9]/85 backdrop-blur-[2px] sm:backdrop-blur-none rounded-2xl p-6 sm:p-0">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.q} className="py-4.5 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-serif text-base sm:text-lg text-[#162e21] hover:text-[#0c2217] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xl font-light text-[#162e21] shrink-0 transition-transform duration-300">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/85 font-sans pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 7. Closing Luxury CTA Banner — Exactly matching Group 24.png Slide 7
 */
function ShopClosingBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#073125]">
      <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[603px] w-full flex items-center justify-center">
        <img
          src={radiantModelsDuoBgImg}
          alt="Mile Infinity — Your skin. Your ritual. Your Mile Infinity."
          className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
        />

        <div className="relative z-10 text-center px-4 max-w-2xl py-16 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.2] text-white">
            Your skin.<br />
            Your ritual.<br />
            <span className="italic">Your Mile Infinity.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/85 font-sans max-w-lg mx-auto leading-relaxed">
            Discover skincare designed to make everyday care feel more intentional.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <a
              href="#shop-catalog"
              className="bg-[#ede9e1] hover:bg-white text-[#162e21] px-7 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Shop All Skincare</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="/#approach"
              className="border border-white/70 hover:border-white bg-[#073125]/40 hover:bg-[#073125]/70 backdrop-blur-sm text-white px-7 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <span>Explore The Brand</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
