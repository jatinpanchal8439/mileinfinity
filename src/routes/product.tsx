import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Search,
  Sparkles,
  X,
  Maximize2,
  CreditCard,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { RunningTicker } from "@/components/running-ticker";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import { RazorpayCheckoutModal } from "@/components/razorpay-checkout-modal";

// Assets
import heroBeetrootStillLifeImg from "@/assets/hero-beetroot-still-life.png";
import thumb1Img from "@/assets/thumb-beetroot-1.png";
import thumb2Img from "@/assets/thumb-beetroot-2.png";
import thumb3Img from "@/assets/thumb-beetroot-3.png";
import thumb4Img from "@/assets/thumb-beetroot-4.png";
import modelBeetrootPortraitImg from "@/assets/model-beetroot-portrait.png";

import contactBeetrootImg from "@/assets/contact-beetroot-wash.png";
import contactGreenSerumImg from "@/assets/contact-green-serum.png";
import contactBlueberryImg from "@/assets/contact-blueberry-cream.png";
import contactSunscreenImg from "@/assets/contact-sunscreen-spf50.png";

import naturalGlowMatchaAdImg from "@/assets/natural-glow-matcha-ad.png";
import sunlitForestBottlesImg from "@/assets/sunlit-forest-bottles.png";
import botanicalCollageImg from "@/assets/botanical-ingredient-collage.png";
import dewyMatchaForestImg from "@/assets/dewy-matcha-forest.png";

import cropStep01 from "@/assets/crop-step-01.png";
import cropStep02 from "@/assets/crop-step-02.png";
import cropStep03 from "@/assets/crop-step-03.png";
import cropStep04 from "@/assets/crop-step-04.png";

// Comprehensive Product Catalog Definition
export interface ProductDetail {
  id: string;
  slug: string;
  stepNum: string;
  stepTag: string;
  categoryKicker: string;
  name: string;
  shortName: string;
  priceInr: number;
  size: string;
  description: string;
  howToUse: string[];
  skinType: string;
  specs: {
    netQuantity: string;
    fragrance: string;
    keyActives: string;
    ethics: string;
  };
  gallery: { src: string; label: string; caption: string }[];
  essentials: { num: string; title: string; desc: string }[];
  story: {
    eyebrow: string;
    title: string;
    desc1: string;
    desc2: string;
    image: string;
  };
  faqs: { q: string; a: string }[];
}

export const PRODUCTS: ProductDetail[] = [
  {
    id: "prod-1",
    slug: "crimson-beauty-beetroot-facewash",
    stepNum: "01",
    stepTag: "01 / CLEANSE",
    categoryKicker: "Face Wash · The Cleansing Step",
    name: "Mile Infinity Crimson Beauty Beetroot Facewash",
    shortName: "Beetroot Face Wash",
    priceInr: 999,
    size: "100 ml / 3.3 FL OZ",
    description:
      "A beetroot-inspired face wash to begin your everyday skincare ritual. Your first step before treatment, moisture and daytime protection.",
    howToUse: [
      "Use as the first step in your skincare routine.",
      "Follow the application directions on the product packaging.",
      "Follow with serum and moisturiser. Finish with sunscreen during the day.",
    ],
    skinType: "For all skin types.",
    specs: {
      netQuantity: "100 ml / 3.3 FL OZ",
      fragrance: "No Perfume",
      keyActives: "AHA, DHA & Mulberry",
      ethics: "Cruelty-Free",
    },
    gallery: [
      { src: thumb1Img, label: "Packaging", caption: "Mile Infinity Beetroot Face Wash — 100ml / 3.3 FL OZ" },
      { src: thumb2Img, label: "Ingredients", caption: "Key Benefits & Active Ingredients: AHA, DHA & Mulberry" },
      { src: thumb3Img, label: "How to Use", caption: "Directions & Ritual Steps for All Skin Types" },
      { src: thumb4Img, label: "Ritual", caption: "Ritual in Every Drop — Gentle Cleansing Experience" },
      { src: contactBeetrootImg, label: "Editorial", caption: "Botanical Still Life on Natural Stone" },
    ],
    essentials: [
      { num: "01", title: "Begin with cleansing.", desc: "A face wash that gives the cleansing step a clear place in your everyday care." },
      { num: "02", title: "Inspired by beetroot.", desc: "A botanical reference at the heart of the Crimson Beauty story." },
      { num: "03", title: "Part of a considered ritual.", desc: "Start here, then treat, moisturise and finish with protection in the daytime." },
    ],
    story: {
      eyebrow: "Rooted in Nature",
      title: "A botanical story. An everyday beginning.",
      desc1: "Crimson Beauty takes its inspiration from beetroot, bringing a botanical point of view to the first step of your Mile Infinity routine.",
      desc2: "This face wash belongs at the beginning: a cleansing step before your serum, moisturiser and daytime sunscreen. A focused essential in a four-step ritual, thoughtfully kept simple.",
      image: modelBeetrootPortraitImg,
    },
    faqs: [
      { q: "Where does this face wash fit in my routine?", a: "Begin with Crimson Beauty to cleanse. Follow with treatment, moisturiser and, in the daytime, sun protection. Follow each product's packaging directions." },
      { q: "Does beetroot inspiration confirm the ingredients?", a: "No. Botanical inspiration is not a full ingredient declaration. Refer to the product packaging for the complete ingredient / INCI list." },
      { q: "Is it suitable for my skin?", a: "Suitable for all skin types. Check the ingredient list, suitability guidance and precautions on the packaging before use." },
      { q: "How should I store Crimson Beauty?", a: "Store in a cool, dry place away from direct sunlight. Follow the storage guidance and expiry information printed on your product packaging." },
      { q: "What should I know about shipping and returns?", a: "We offer complimentary standard shipping across India on all orders. Returns and replacements are supported within 14 days." },
    ],
  },
  {
    id: "prod-2",
    slug: "ceremonial-green-fusion-serum",
    stepNum: "02",
    stepTag: "02 / TREAT",
    categoryKicker: "Face Serum · The Treatment Step",
    name: "Mile Infinity Ceremonial Green Fusion Serum",
    shortName: "Green Fusion Serum",
    priceInr: 1599,
    size: "30 ml / 1.0 FL OZ",
    description:
      "A green tea-inspired serum for the treatment step in your routine. Concentrated botanicals and antioxidant actives to restore skin vitality and natural balance.",
    howToUse: [
      "Dispense 3-4 drops onto freshly cleansed, slightly damp skin.",
      "Gently press into face and neck with upward motions until fully absorbed.",
      "Follow with moisturiser to lock in active botanicals. Use morning and evening.",
    ],
    skinType: "All skin types, especially dull, tired or unbalanced skin.",
    specs: {
      netQuantity: "30 ml / 1.0 FL OZ",
      fragrance: "Fragrance-Free",
      keyActives: "Japanese Green Tea, White Tea & Avocado",
      ethics: "Cruelty-Free & 100% Vegan",
    },
    gallery: [
      { src: contactGreenSerumImg, label: "Packaging", caption: "Mile Infinity Ceremonial Green Fusion Serum — 30ml / 1.0 FL OZ" },
      { src: cropStep02, label: "Ingredients", caption: "Matcha Tea, White Tea, Avocado & Niacinamide" },
      { src: naturalGlowMatchaAdImg, label: "How to Use", caption: "Gently press into face and neck after cleansing" },
      { src: dewyMatchaForestImg, label: "Ritual", caption: "A restorative ritual of botanical energy and hydration" },
      { src: contactGreenSerumImg, label: "Editorial", caption: "Ceremonial Green Fusion Still Life" },
    ],
    essentials: [
      { num: "01", title: "Targeted treatment.", desc: "Concentrated botanical actives deliver antioxidant restoration directly to cleansed skin." },
      { num: "02", title: "Green & white tea.", desc: "Harnesses natural polyphenols and cold-pressed avocado for supple radiance." },
      { num: "03", title: "Step two of your ritual.", desc: "Layer between your cleanser and moisturiser for optimal barrier absorption." },
    ],
    story: {
      eyebrow: "Rooted in Nature",
      title: "Restorative botanicals. Daily vitality.",
      desc1: "Ceremonial Green Fusion Serum harnesses Japanese matcha and white tea to deliver concentrated antioxidants directly where skin needs it most.",
      desc2: "Formulated to balance tone, soothe environmental stress, and provide lightweight hydration that absorbs effortlessly without sticky residue.",
      image: naturalGlowMatchaAdImg,
    },
    faqs: [
      { q: "When should I apply this serum?", a: "Apply immediately after cleansing while skin is still slightly damp. Allow 60 seconds to absorb before applying moisturiser." },
      { q: "Can I use it both morning and night?", a: "Yes. Green Fusion Serum is formulated for twice-daily application to defend against daytime oxidants and restore overnight." },
      { q: "Is it suitable for sensitive skin?", a: "Yes. Formulated without synthetic fragrance or drying alcohols, it is soothing on sensitive skin types." },
      { q: "How many drops are recommended?", a: "3 to 4 drops are sufficient for full face and neck coverage." },
      { q: "Does it feel greasy?", a: "No. It absorbs within seconds to a silky, weightless velvet touch." },
    ],
  },
  {
    id: "prod-3",
    slug: "blueberry-lavender-bliss-moisturiser",
    stepNum: "03",
    stepTag: "03 / HYDRATE",
    categoryKicker: "Moisturiser · The Hydration Step",
    name: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
    shortName: "Bliss Moisturiser",
    priceInr: 1099,
    size: "50 ml / 1.7 FL OZ",
    description:
      "Wild blueberry and French lavender inspiration for your daily moisturising step. Locks in deep barrier hydration, soothing the skin with a cloud-light, non-greasy finish.",
    howToUse: [
      "Take a dime-sized amount onto clean fingertips.",
      "Smooth gently over face and décolletage after your serum has absorbed.",
      "Use morning and evening for deep, soothing barrier hydration.",
    ],
    skinType: "All skin types, ideal for dry, normal, and combination skin.",
    specs: {
      netQuantity: "50 ml / 1.7 FL OZ",
      fragrance: "Natural Lavender & Blueberry",
      keyActives: "Wild Blueberry, Lavender & Squalane",
      ethics: "Cruelty-Free & Non-Comedogenic",
    },
    gallery: [
      { src: contactBlueberryImg, label: "Packaging", caption: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser — 50ml" },
      { src: cropStep03, label: "Ingredients", caption: "Wild Blueberry Extract, French Lavender & Ceramides" },
      { src: sunlitForestBottlesImg, label: "How to Use", caption: "Smooth evenly over face and neck morning and evening" },
      { src: contactBlueberryImg, label: "Ritual", caption: "Soothing aromatic relaxation for skin and mind" },
      { src: contactBlueberryImg, label: "Editorial", caption: "Bliss Moisturiser Botanical Jar Still Life" },
    ],
    essentials: [
      { num: "01", title: "Seal in hydration.", desc: "Forms an airy, protective moisture seal over active serum treatments." },
      { num: "02", title: "Blueberry & lavender.", desc: "Rich in anthocyanins to calm redness and support healthy lipid recovery." },
      { num: "03", title: "Cloud-cream texture.", desc: "Non-greasy, fast-absorbing barrier cream that leaves skin soft and supple." },
    ],
    story: {
      eyebrow: "Rooted in Nature",
      title: "Calming botanicals. Velvety barrier care.",
      desc1: "Bliss Moisturiser unites polyphenol-rich blueberries with French lavender to soothe, nourish, and defend the delicate lipid barrier.",
      desc2: "Its unique cloud-cream texture melts seamlessly into the skin, replenishing lost moisture and leaving a supple, radiant finish.",
      image: sunlitForestBottlesImg,
    },
    faqs: [
      { q: "Is this moisturiser heavy or greasy?", a: "No. It is crafted as a breathable cloud-cream that leaves skin hydrated without feeling congested." },
      { q: "Can I wear makeup over this moisturiser?", a: "Yes. It creates a smooth, velvety canvas that works beautifully under daytime sunscreen and makeup." },
      { q: "Does it contain artificial perfume?", a: "No. The subtle scent comes exclusively from botanical lavender and blueberry extracts." },
      { q: "Is it suitable for acne-prone skin?", a: "Yes. The formulation is non-comedogenic and contains calming botanical extracts." },
      { q: "How long does one 50ml jar last?", a: "With twice-daily use, one jar typically lasts 6 to 8 weeks." },
    ],
  },
  {
    id: "prod-4",
    slug: "sunnykiss-radiance-spf-sunscreen",
    stepNum: "04",
    stepTag: "04 / PROTECT",
    categoryKicker: "Sunscreen · The Daily Protection Step",
    name: "Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen",
    shortName: "Radiance SPF 50",
    priceInr: 1299,
    size: "100 ml / 3.3 FL OZ",
    description:
      "Broad-spectrum SPF 50 UVA/UVB sunscreen to complete your daytime skincare routine. Weightless daily radiance defense with zero white cast, infused with licorice and centella.",
    howToUse: [
      "Apply generously as the final step of your morning skincare routine.",
      "Smooth evenly over face, neck, and ears 15 minutes before sun exposure.",
      "Reapply every 2 hours during continuous outdoor activity.",
    ],
    skinType: "All skin types, broad spectrum UV protection with zero white cast.",
    specs: {
      netQuantity: "100 ml / 3.3 FL OZ",
      fragrance: "No Perfume",
      keyActives: "SPF 50 PA++++, Licorice & Centella",
      ethics: "Cruelty-Free & Reef-Safe",
    },
    gallery: [
      { src: contactSunscreenImg, label: "Packaging", caption: "Mile Infinity Sunnykiss Radiance SPF 50 — 100ml / 3.3 FL OZ" },
      { src: cropStep04, label: "Ingredients", caption: "SPF 50 PA++++, Licorice Extract, Centella & Niacinamide" },
      { src: botanicalCollageImg, label: "How to Use", caption: "Apply generously as final morning ritual step" },
      { src: contactSunscreenImg, label: "Ritual", caption: "Invisible daily shield against photoaging" },
      { src: contactSunscreenImg, label: "Editorial", caption: "Sunnykiss Radiance Sunscreen Still Life" },
    ],
    essentials: [
      { num: "01", title: "Daily UV defense.", desc: "Broad-spectrum SPF 50 PA++++ shields against photoaging and sun damage." },
      { num: "02", title: "Zero white cast.", desc: "Melts completely clear into all skin tones with a dewy, natural finish." },
      { num: "03", title: "Final morning step.", desc: "The crucial shield that safeguards all your previous ritual steps." },
    ],
    story: {
      eyebrow: "Rooted in Nature",
      title: "Broad-spectrum defense. Invisible radiance.",
      desc1: "Sunnykiss Radiance SPF 50 provides essential broad-spectrum shield against UVA and UVB rays without leaving a chalky white cast or heavy feel.",
      desc2: "Infused with skin-brightening licorice extract and soothing centella asiatica, it protects while keeping your skin hydrated and glowing all day.",
      image: contactSunscreenImg,
    },
    faqs: [
      { q: "Does Sunnykiss SPF 50 leave a white cast?", a: "No. It is formulated to absorb completely transparent across all skin tones." },
      { q: "Is this water and sweat resistant?", a: "It provides light sweat resistance suitable for daily wear. Reapplication every 2 hours is recommended outdoors." },
      { q: "Can I use this around my eyes?", a: "Yes. The gentle, fragrance-free formula is designed not to sting sensitive eye areas." },
      { q: "Is it safe for coral reefs?", a: "Yes. Our UV filter complex excludes oxybenzone and octinoxate." },
      { q: "Does it work well under makeup?", a: "Yes. It leaves a radiant, non-pilling, lightweight canvas." },
    ],
  },
];

interface ProductSearchParams {
  id?: string | undefined;
  slug?: string | undefined;
}

export const Route = createFileRoute("/product")({
  validateSearch: (search: Record<string, unknown>): ProductSearchParams => {
    const rawId = search["id"];
    const rawSlug = search["slug"];
    const result: ProductSearchParams = {};
    if (typeof rawId === "string") result.id = rawId;
    if (typeof rawSlug === "string") result.slug = rawSlug;
    return result;
  },
  component: ProductDetailsPage,
  head: () => ({
    title: "Mile Infinity Botanical Skincare — The Four-Step Ritual",
    meta: [
      {
        name: "description",
        content:
          "Four considered essentials for cleansing, treatment, hydration, and daytime protection.",
      },
    ],
  }),
});

export function ProductDetailsPage() {
  const search = Route.useSearch();
  const [selectedId, setSelectedId] = useState<string>("prod-1");

  useEffect(() => {
    if (search.id) {
      setSelectedId(search.id);
    } else if (search.slug) {
      const match = PRODUCTS.find((p) => p.slug === search.slug);
      if (match) setSelectedId(match.id);
    }
  }, [search.id, search.slug]);

  const currentProduct = PRODUCTS.find((p) => p.id === selectedId) || PRODUCTS[0]!;

  const handleSelectProduct = (id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell>
      {/* 1. Dynamic Product Switcher Ribbon */}
      <ProductSwitcherRibbon
        currentId={currentProduct.id}
        onSelect={handleSelectProduct}
      />

      {/* 2. Main Product Details Hero */}
      <ProductDetailsHero product={currentProduct} />

      {/* 3. Continuous Running Ticker Carousel */}
      <RunningTicker variant="dark" />

      {/* 4. The Essentials, Considered Section */}
      <ProductEssentialsConsidered product={currentProduct} />

      {/* 5. A Botanical Story Editorial Section */}
      <ProductBotanicalStory product={currentProduct} />

      {/* 6. Complete Your Routine (Other 3 Complementary Products) */}
      <ProductCompleteRoutine
        currentProduct={currentProduct}
        onSelectProduct={handleSelectProduct}
      />

      {/* 7. Frequently Asked Questions */}
      <ProductFaqSection product={currentProduct} />

      {/* 8. Closing Sticky / Bottom Banner */}
      <ProductClosingBanner product={currentProduct} />
    </PageShell>
  );
}

/**
 * 1. Product Switcher Ribbon: Clean, sticky tab bar to switch between the 4 essentials
 */
function ProductSwitcherRibbon({
  currentId,
  onSelect,
}: {
  currentId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="border-b border-[#e5dfd5] bg-[#faf8f4] py-2.5 sm:py-3 sticky top-[68px] sm:top-[74px] z-30 shadow-2xs">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16 flex items-center justify-between gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#162e21]/55 font-sans shrink-0 hidden md:inline">
          Explore The Ritual:
        </span>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 mx-auto sm:mx-0 w-full sm:w-auto justify-between sm:justify-start">
          {PRODUCTS.map((p) => {
            const isActive = p.id === currentId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={`px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase transition-all rounded-none cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#162e21] text-white shadow-xs"
                    : "bg-white text-[#162e21]/70 hover:text-[#162e21] border border-[#e5dfd5] hover:border-[#162e21]/40"
                }`}
              >
                <span>{p.stepTag.split(" / ")[0]}</span>
                <span className="hidden sm:inline ml-1 font-serif lowercase italic">
                  {p.stepTag.split(" / ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Product Details Hero Section: Fully dynamic for whichever product is selected
 */
function ProductDetailsHero({ product }: { product: ProductDetail }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // Reset active thumbnail when switching products
  useEffect(() => {
    setActiveThumb(0);
    setQuantity(1);
  }, [product.id]);

  const activeItem = product.gallery[activeThumb] || product.gallery[0]!;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      add({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: product.size,
        priceInr: product.priceInr,
        imageUrl: product.gallery[0]?.src || "",
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="bg-white py-6 sm:py-12 lg:py-16 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-start">
          {/* Left Column: Gallery (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-6">
            {/* Thumbnails Row on mobile / Column on desktop */}
            <div className="flex sm:flex-col gap-2 sm:gap-3 shrink-0 overflow-x-auto no-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
              {product.gallery.map((t, idx) => (
                <button
                  key={`${product.id}-${t.label}-${idx}`}
                  type="button"
                  onClick={() => setActiveThumb(idx)}
                  className={`group relative w-14 h-16 sm:w-20 sm:h-24 overflow-hidden rounded-xs border transition-all shrink-0 cursor-pointer ${
                    activeThumb === idx
                      ? "border-[#162e21] ring-2 ring-[#162e21] shadow-sm"
                      : "border-[#e5dfd5] hover:border-[#162e21]/50 opacity-80 hover:opacity-100"
                  }`}
                  title={t.label}
                >
                  <img
                    src={t.src}
                    alt={t.label}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-[#162e21]/80 text-[7px] sm:text-[9px] text-white py-0.5 text-center font-sans tracking-wider uppercase backdrop-blur-xs">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Big Product Display Container */}
            <div className="relative aspect-[4/5] flex-1 bg-[#f9f7f2] overflow-hidden border border-[#e5dfd5]/80 rounded-xs group flex items-center justify-center">
              <img
                src={activeItem.src}
                alt={activeItem.caption}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Magnifying Glass Zoom Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 h-9 w-9 sm:h-10 sm:w-10 bg-white/95 backdrop-blur-md border border-[#162e21]/20 flex items-center justify-center text-[#162e21] shadow-md hover:bg-[#162e21] hover:text-white transition-all duration-200 cursor-pointer"
                aria-label="Enlarge image"
                title="Click to zoom image"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Sub-label badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm border border-[#162e21]/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#162e21] font-medium shadow-xs">
                {activeItem.label}
              </div>
            </div>
          </div>

          {/* Lightbox / Fullscreen Modal */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
              onClick={() => setLightboxOpen(false)}
            >
              <div
                className="relative max-h-[94vh] w-full max-w-sm sm:max-w-2xl bg-[#f7f5f0] p-3 sm:p-5 rounded-xs shadow-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#e5dfd5]">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#162e21]">
                      {activeItem.label}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#2c3d33]/70 font-sans">
                      {activeItem.caption}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(false)}
                    className="p-1.5 text-[#162e21]/70 hover:text-[#162e21] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-center overflow-auto max-h-[60vh] sm:max-h-[70vh]">
                  <img
                    src={activeItem.src}
                    alt={activeItem.caption}
                    className="max-h-[58vh] sm:max-h-[68vh] w-auto object-contain rounded-xs shadow-sm"
                  />
                </div>

                {/* Thumbnails strip inside Lightbox */}
                <div className="mt-3 flex items-center justify-center gap-1.5 sm:gap-2 pt-2 border-t border-[#e5dfd5] overflow-x-auto no-scrollbar">
                  {product.gallery.map((item, idx) => (
                    <button
                      key={`lightbox-${item.label}-${idx}`}
                      onClick={() => setActiveThumb(idx)}
                      className={`h-10 w-9 sm:h-12 sm:w-10 overflow-hidden border rounded-xs transition-all shrink-0 cursor-pointer ${
                        activeThumb === idx
                          ? "border-[#162e21] ring-2 ring-[#162e21]"
                          : "border-[#e5dfd5] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Dynamic Product Info & Actions (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Kicker */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#162e21]/70 font-sans">
                {product.categoryKicker}
              </p>

              {/* Title */}
              <h1 className="mt-2.5 font-serif text-2xl sm:text-3xl lg:text-[38px] font-normal leading-tight text-[#162e21]">
                {product.name}
              </h1>

              {/* Price */}
              <p className="mt-2.5 font-serif text-2xl font-normal text-[#162e21]">
                {formatInr(product.priceInr)}
              </p>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-[#2c3d33]/85 leading-relaxed font-sans">
                {product.description}
              </p>

              <hr className="my-5 sm:my-6 border-[#e5dfd5]" />

              {/* How to use */}
              <div>
                <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#162e21] font-sans">
                  How to use
                </h2>
                <ul className="mt-2.5 space-y-2 text-xs sm:text-[13px] text-[#2c3d33]/85 font-sans leading-relaxed">
                  {product.howToUse.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#162e21] mt-0.5">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skin type */}
              <div className="mt-5 sm:mt-6">
                <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#162e21] font-sans">
                  Skin type
                </h2>
                <ul className="mt-2 space-y-1.5 text-xs sm:text-[13px] text-[#2c3d33]/85 font-sans leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#162e21] mt-0.5">•</span>
                    <span>{product.skinType}</span>
                  </li>
                </ul>
              </div>

              <hr className="my-5 sm:my-6 border-[#e5dfd5]" />

              {/* Dynamic Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs text-[#162e21]/80 font-sans bg-[#f7f5ef] p-3 sm:p-3.5 rounded-xs border border-[#e5dfd5]">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#162e21]/60 block font-medium">Net Quantity</span>
                  <span className="font-medium text-[#162e21] text-xs">{product.specs.netQuantity}</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#162e21]/60 block font-medium">Fragrance</span>
                  <span className="font-medium text-[#162e21] text-xs">{product.specs.fragrance}</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#162e21]/60 block font-medium">Key Actives</span>
                  <span className="font-medium text-[#162e21] text-xs">{product.specs.keyActives}</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#162e21]/60 block font-medium">Ethics</span>
                  <span className="font-medium text-[#162e21] text-xs">{product.specs.ethics}</span>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart button */}
            <div className="mt-6 sm:mt-8 pt-2">
              <label className="block text-xs font-medium text-[#162e21] mb-2 font-sans">
                Quantity
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center justify-between border border-[#162e21]/30 bg-[#f7f5ef] px-4 py-3 sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-[#162e21]/70 hover:text-[#162e21] p-0.5 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-medium text-[#162e21] font-sans">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-[#162e21]/70 hover:text-[#162e21] p-0.5 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#162e21] hover:bg-[#0c2217] text-white py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm cursor-pointer"
                >
                  {added ? (
                    <span className="inline-flex items-center gap-2 text-emerald-300">
                      <Check className="h-4 w-4" /> Added to Cart
                    </span>
                  ) : (
                    <>
                      <span>Add to Cart</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

                {/* Instant Buy with Razorpay */}
                <button
                  type="button"
                  onClick={() => setIsRazorpayOpen(true)}
                  className="bg-[#0c2340] hover:bg-[#143763] text-white py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm cursor-pointer border border-[#1a4473] active:scale-95"
                >
                  <CreditCard className="h-4 w-4 text-[#528ff0]" />
                  <span>Instant Pay (Razorpay)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Razorpay Checkout Modal */}
        <RazorpayCheckoutModal
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.categoryKicker,
            priceInr: product.priceInr,
            imageUrl: product.gallery[0]?.src,
            size: product.size,
            tagline: product.description,
          }}
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
        />
      </div>
    </section>
  );
}

/**
 * 4. "THE ESSENTIALS, CONSIDERED" Section: Dynamically tailored to the selected product
 */
function ProductEssentialsConsidered({ product }: { product: ProductDetail }) {
  return (
    <section className="bg-[#ffffff] py-14 sm:py-16 lg:py-20 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
            The Essentials, Considered
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-[42px] font-normal text-[#162e21]">
            A simple place to begin.
          </h2>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {product.essentials.map((s) => (
            <div key={s.num} className="border-t border-[#e5dfd5] pt-5 sm:pt-6">
              <span className="block text-xs font-semibold text-[#8b9d8c] font-sans">
                {s.num}
              </span>
              <h3 className="mt-2 font-serif text-lg sm:text-xl lg:text-2xl font-normal text-[#162e21]">
                {s.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-[#2c3d33]/80 leading-relaxed font-sans">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 5. Editorial Story Section: Dynamically displays botanical heritage for the product
 */
function ProductBotanicalStory({ product }: { product: ProductDetail }) {
  return (
    <section className="bg-[#faf8f4] py-14 sm:py-16 lg:py-24 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Story Copy (col-span-6) */}
          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              {product.story.eyebrow}
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-[44px] font-normal text-[#162e21] leading-tight">
              {product.story.title}
            </h2>

            <p className="mt-5 text-xs sm:text-sm lg:text-base text-[#2c3d33]/85 leading-relaxed font-sans max-w-lg">
              {product.story.desc1}
            </p>

            <p className="mt-4 text-xs sm:text-sm lg:text-base text-[#2c3d33]/85 leading-relaxed font-sans max-w-lg">
              {product.story.desc2}
            </p>

            <hr className="mt-6 sm:mt-8 border-[#e5dfd5] max-w-lg" />
          </div>

          {/* Right Column: Artwork (col-span-6) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg aspect-[4/4.5] overflow-hidden border border-[#e5dfd5] shadow-lg bg-[#f7f5ef]">
              <img
                src={product.story.image}
                alt={product.story.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 6. "Complete your routine." Section: Shows the OTHER 3 products and lets user switch
 */
function ProductCompleteRoutine({
  currentProduct,
  onSelectProduct,
}: {
  currentProduct: ProductDetail;
  onSelectProduct: (id: string) => void;
}) {
  const { add } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Filter out current product so other 3 are displayed
  const complementaryProducts = PRODUCTS.filter((p) => p.id !== currentProduct.id);

  const handleAdd = (item: ProductDetail) => {
    add({
      productId: item.id,
      slug: item.slug,
      name: item.name,
      size: item.size,
      priceInr: item.priceInr,
      imageUrl: item.gallery[0]?.src || "",
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-24 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-8 sm:pb-10 border-b border-[#162e21]/15">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Beyond {currentProduct.stepTag.split(" / ")[1]}
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-[44px] font-normal text-[#162e21] leading-tight">
              Complete your routine.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#2c3d33]/80 leading-relaxed font-sans max-w-md">
            Continue through the four-step Mile Infinity ritual. Three complementary essentials crafted to work in complete harmony.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {complementaryProducts.map((item) => {
            const isAdded = addedId === item.id;
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between bg-white p-4 transition-all duration-300 border border-[#e5dfd5] hover:shadow-xl"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(item.id)}
                    className="w-full aspect-[4/5] overflow-hidden bg-[#faf8f4] flex items-center justify-center cursor-pointer block"
                  >
                    <img
                      src={item.gallery[0]?.src}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>

                  <div className="mt-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b7b6c] font-sans">
                      {item.stepTag}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item.id)}
                      className="mt-1.5 font-serif text-base sm:text-lg font-normal text-[#162e21] leading-snug min-h-[3rem] text-left hover:underline cursor-pointer block"
                    >
                      {item.name}
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#ede7dc]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-serif text-base font-medium text-[#162e21]">
                      {formatInr(item.priceInr)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item.id)}
                      className="text-[11px] font-semibold uppercase tracking-wider text-[#162e21] hover:underline cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="w-full bg-[#162e21] hover:bg-[#0c2217] text-white py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm cursor-pointer"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * 7. Frequently Asked Questions: Dynamically displays product-tailored FAQs
 */
function ProductFaqSection({ product }: { product: ProductDetail }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-[#faf8f4] py-14 sm:py-16 lg:py-24 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Good to Know
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-[46px] font-normal text-[#162e21] leading-tight">
              Frequently asked<br />
              questions.
            </h2>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#2c3d33]/85 leading-relaxed font-sans max-w-sm">
              A little clarity before you begin your {product.shortName} ritual.
            </p>

            <div className="mt-6 sm:mt-8 pt-2">
              <Link
                to="/contact"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:underline"
              >
                Contact Mile Infinity
              </Link>
            </div>
          </div>

          {/* Right Column: Accordions */}
          <div className="lg:col-span-8 divide-y divide-[#162e21]/15">
            {product.faqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={`${product.id}-faq-${idx}`} className="py-5 sm:py-6 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer"
                  >
                    <span className="font-serif text-base sm:text-lg lg:text-xl font-normal text-[#162e21] group-hover:text-[#2c4d36] transition-colors leading-snug">
                      {item.q}
                    </span>
                    <span className="text-lg text-[#162e21]/60 shrink-0 font-serif w-6 text-center">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3.5 pr-4 sm:pr-8">
                      <p className="text-xs sm:text-sm text-[#2c3d33]/85 leading-relaxed font-sans">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom links */}
            <div className="pt-6 flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21]">
              <Link to="/contact" className="hover:underline">Shipping</Link>
              <Link to="/contact" className="hover:underline">Returns</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 8. Closing Sticky / Bottom Banner: Dynamically shows selected product
 */
function ProductClosingBanner({ product }: { product: ProductDetail }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: product.size,
      priceInr: product.priceInr,
      imageUrl: product.gallery[0]?.src || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="bg-[#12281e] text-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left: Thumbnail & Details */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 overflow-hidden border border-white/20 bg-white/5 shrink-0">
              <img
                src={product.gallery[0]?.src}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60 font-sans">
                Your Ritual Begins Here · {product.stepTag}
              </p>
              <h3 className="mt-1 font-serif text-lg sm:text-xl lg:text-2xl font-normal text-white">
                {product.name}
              </h3>
              <p className="mt-1 font-serif text-base sm:text-lg text-white/90">
                {formatInr(product.priceInr)}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center sm:items-end gap-3 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#f7f5ef] hover:bg-white text-[#162e21] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all rounded-none shadow-md cursor-pointer"
            >
              {added ? (
                <span className="inline-flex items-center gap-2 text-emerald-800">
                  <Check className="h-4 w-4" /> Added to Cart
                </span>
              ) : (
                <>
                  <span>Add to Cart</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            <Link
              to="/shop"
              className="text-xs text-white/75 hover:text-white underline font-sans tracking-wide"
            >
              Shop all skincare
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
