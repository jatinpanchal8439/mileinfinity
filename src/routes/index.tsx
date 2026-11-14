import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import {
  Check,
  Leaf,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Sun,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  CreditCard,
  Flower2,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { RunningTicker } from "@/components/running-ticker";
import { productsQueryOptions } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import type { ProductDto } from "@/lib/store.functions";

// High-resolution Figma and reference assets
import heroRainbowImg from "@/assets/hero-rainbow-moisturizer-2x.jpg";
import botanicalHeroImg from "@/assets/botanical-hero-still-life.png";
import goldenSerumImg from "@/assets/golden-serum-approach.png";
import goldenApproachDishImg from "@/assets/golden-approach-dish.png";
import goldenInfinityImg from "@/assets/golden-infinity-spa.png";
import navtakshLogo from "@/assets/navtaksh-wellness-logo.png";
import mileInfinityLogo from "@/assets/mile-infinity-logo.png";
import logoSvg from "@/assets/mile-infinity-logo.svg";
import cardBeetrootImg from "@/assets/card-beetroot.png";
import cardGreenImg from "@/assets/card-green.png";
import cardBlueberryImg from "@/assets/product-blueberry.png";
import cardSunscreenImg from "@/assets/product-sunscreen.png";
import luxuryMatchaStillLifeImg from "@/assets/luxury-matcha-still-life.png";
import sunlitForestBottlesImg from "@/assets/sunlit-forest-bottles.png";
import botanicalCollageImg from "@/assets/botanical-ingredient-collage.png";
import dewyMatchaForestImg from "@/assets/dewy-matcha-forest.png";
import sereneStoneSpaBgImg from "@/assets/serene-stone-spa-bg.png";
import radiantModelsDuoBgImg from "@/assets/radiant-models-duo-bg.png";
import cropStep01 from "@/assets/crop-step-01.png";
import cropStep02 from "@/assets/crop-step-02.png";
import cropStep03 from "@/assets/crop-step-03.png";
import cropStep04 from "@/assets/crop-step-04.png";
import cinematicEmeraldBg from "@/assets/cinematic-emerald-arc-bg.png";
import routineFinderArtworkImg from "@/assets/routine-finder-artwork.png";
import naturalGlowMatchaAdImg from "@/assets/natural-glow-matcha-ad.png";
import heroBeetrootProductImg from "@/assets/hero-beetroot-still-life.png";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Index,
  head: () => ({
    meta: [
      { title: "Mile Infinity — Botanical Skincare for Everyday Rituals" },
      {
        name: "description",
        content:
          "Thoughtfully formulated skincare inspired by botanical ingredients and created to bring conscious care into your everyday routine.",
      },
      { property: "og:title", content: "Mile Infinity — Botanical Skincare" },
      {
        property: "og:description",
        content: "Botanical skincare, for everyday rituals. Serums, moisturizers and sun care.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const featured = products.slice(0, 4);

  return (
    <PageShell>
      {/* 1. Hero Section matching reference */}
      <Hero />

      {/* 3. The Mile Infinity Approach Section (Slide 1) — Full-Width Background */}
      <ApproachSection />

      {/* 4. Two Brands One Purpose Ecosystem Section (Slide 3) */}
      <TwoBrandsEcosystem />

      {/* 5. Shop The Essentials & Hero Products Showcase Section (id="essentials") */}
      <HomeEssentialsSection products={products} />

      {/* 6. Interactive Two Essentials Bundle Builder (Slide 4, Group 23) */}
      <BundleBuilder />

      {/* 7. Spotlight Daily Skincare Essential (Slide 5) — Matching Luxury Matcha Still Life */}
      <SpotlightMatchaSection />

      {/* 8. Botanical Inspiration & Formulation Standards — Matching Rooted in Nature */}
      <BotanicalInspirationSection />
      <FormulationStandardsBanner />

      {/* 10. Powered by Botanicals Active Ingredients Table */}
      <PoweredByBotanicalsSection />

      {/* 11. Why Mile Infinity matching Dewy Matcha Forest */}
      <WhyMileInfinitySection />

      {/* 12. Find Your Skincare Ritual (Where does your routine begin?) */}
      <RoutineFinderSection />

      {/* 13. Frequently Asked Questions matching Frame 6 */}
      <FaqSection />

      {/* 14. Closing Luxury CTA Banner matching Frame 30 */}
      <ClosingLuxuryBanner />
    </PageShell>
  );
}

/**
 * 1. Hero Section matching User's Mockup:
 * - Uses the uploaded hero background image with pastel rainbow waves, multi-color cream swirl, moisturizer jar & smiling model
 * - Subtag: "PLANT-BASED SKINCARE —"
 * - Heading:
 *     Skincare,
 *     Rooted in Nature.
 * - Description:
 *     "Thoughtfully formulated skincare inspired by botanical ingredients and created to bring conscious care into your everyday routine."
 * - Rectangular Bronze/Olive Button:
 *     "SHOP SKINCARE →" (bg-[#866727])
 * - 4 Benefit Icon Badges:
 *     1) Leaf: PLANT-BASED / FORMULATIONS
 *     2) Droplets: CLEAN / INGREDIENTS
 *     3) Sprout: THOUGHTFULLY / CRAFTED
 *     4) Flower2: SKINCARE / RITUALS
 * - Interactive Clickable Hotspot on the Moisturizer Jar:
 *     Clickable pulse beacon & floating tooltip that directly adds the Blueberry & Lavender Bliss Moisturizer to the cart!
 * - GSAP Entrance Timeline & Float animations
 */
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-subtag",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.1, clearProps: "all" }
      )
        .fromTo(
          ".hero-heading",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, clearProps: "all" },
          "-=0.35"
        )
        .fromTo(
          ".hero-desc",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "all" },
          "-=0.45"
        )
        .fromTo(
          ".hero-cta-btn",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "all" },
          "-=0.4"
        )
        .fromTo(
          ".hero-badge-item",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.45, clearProps: "all" },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-[#faf8f4]"
      aria-label="Hero - Skincare, Rooted in Nature"
    >
      <div className="relative min-h-[460px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[590px] xl:min-h-[620px] w-full flex items-center">
        {/* Full-bleed Hero Background Image matching user upload */}
        <div className="absolute inset-0 overflow-hidden bg-[#faf8f4] select-none">
          <img
            src={heroRainbowImg}
            alt="Mile Infinity Skincare, Rooted in Nature"
            className="h-full w-full object-cover object-[75%_center] sm:object-[68%_center] md:object-[62%_center] lg:object-center select-none pointer-events-none"
          />
          {/* Subtle soft gradient scrim on the left for crisp text contrast */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-[#faf8f4]/95 via-[#faf8f4]/75 to-transparent sm:from-[#faf8f4]/90 sm:via-[#faf8f4]/50 pointer-events-none" />
        </div>

        {/* Text Content Overlay on Left Side */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full pt-4 sm:pt-6 md:pt-7 lg:pt-8 pb-5 sm:pb-6 flex items-center">
          <div className="w-full max-w-lg lg:max-w-xl">
            {/* Kicker with dash matching Screenshot */}
            <div className="hero-subtag inline-flex items-center gap-2.5 mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-[#162e21]/80 font-sans">
                Plant-Based Skincare
              </span>
              <span className="h-[1.5px] w-6 sm:w-8 bg-[#162e21]/60" />
            </div>

            {/* Heading matching Screenshot exactly: "Skincare, Rooted in Nature." */}
            <h1 className="hero-heading font-serif text-[36px] xs:text-[42px] sm:text-5xl md:text-[54px] lg:text-[64px] xl:text-[70px] font-bold tracking-tight text-[#162e21] leading-[1.06]">
              Skincare,<br />
              Rooted in Nature.
            </h1>

            {/* Description */}
            <p className="hero-desc mt-2.5 sm:mt-3.5 text-xs sm:text-[14px] leading-relaxed text-[#2c3d33]/90 max-w-md font-sans">
              Thoughtfully formulated skincare inspired by botanical ingredients and created to
              bring conscious care into your everyday routine.
            </p>

            {/* Rectangular Bronze/Olive Button matching Screenshot with luxury shimmer animation */}
            <div className="mt-4 sm:mt-6">
              <a
                href="#essentials"
                className="hero-cta-btn relative group overflow-hidden inline-flex items-center justify-center gap-3 rounded-none bg-[#715822] hover:bg-[#5d481b] px-7 sm:px-9 py-3 sm:py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 hover:shadow-xl hover:gap-4 text-center active:scale-95 cursor-pointer z-20"
              >
                {/* Shimmer sweep effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="relative z-10 font-semibold tracking-[0.18em]">Shop Skincare</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            {/* 4 Benefit Icon Badges matching Screenshot */}
            <div className="mt-5 sm:mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-3.5 sm:pt-5 border-t border-[#162e21]/20 max-w-lg">
              {/* Badge 1: Leaf - Plant-Based Formulations */}
              <div className="hero-badge-item flex flex-col items-start gap-2 group/badge cursor-default">
                <div className="text-[#162e21] transition-transform duration-300 group-hover/badge:scale-120 group-hover/badge:-rotate-6">
                  <Leaf className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="text-[10px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#162e21] leading-tight font-sans">
                  Plant-Based<br />Formulations
                </span>
              </div>

              {/* Badge 2: Droplets - Clean Ingredients */}
              <div className="hero-badge-item flex flex-col items-start gap-2 group/badge cursor-default">
                <div className="text-[#162e21] transition-transform duration-300 group-hover/badge:scale-120 group-hover/badge:translate-y-[-2px]">
                  <Droplets className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="text-[10px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#162e21] leading-tight font-sans">
                  Clean<br />Ingredients
                </span>
              </div>

              {/* Badge 3: Sprout - Thoughtfully Crafted */}
              <div className="hero-badge-item flex flex-col items-start gap-2 group/badge cursor-default">
                <div className="text-[#162e21] transition-transform duration-300 group-hover/badge:scale-120 group-hover/badge:rotate-6">
                  <Sprout className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="text-[10px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#162e21] leading-tight font-sans">
                  Thoughtfully<br />Crafted
                </span>
              </div>

              {/* Badge 4: Flower/Lotus - Skincare Rituals */}
              <div className="hero-badge-item flex flex-col items-start gap-2 group/badge cursor-default">
                <div className="text-[#162e21] transition-transform duration-300 group-hover/badge:scale-120 group-hover/badge:rotate-12">
                  <Flower2 className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="text-[10px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-[#162e21] leading-tight font-sans">
                  Skincare<br />Rituals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 2. Dark Forest Green Continuous Running Ticker Carousel
 */
function TickerRibbon() {
  return <RunningTicker variant="dark" />;
}

/**
 * 3. The Mile Infinity Approach Section:
 * - Uses Golden Serum still life as full-bleed background image
 * - Clean white canvas (#ffffff)
 * - 7 columns left clearance so the dish and cream swirls are 100% unobstructed
 * - Right 5 columns for editorial typography
 */
function ApproachSection() {
  return (
    <section id="approach" className="relative w-full overflow-hidden bg-white border-t border-[#f0ede6]">
      {/* Full-bleed still life background image */}
      <img
        src={goldenSerumImg}
        alt="The Mile Infinity Approach — Golden serum dish and botanical cream"
        className="absolute inset-0 h-full w-full object-cover object-left select-none pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16 min-h-auto lg:min-h-[720px] xl:min-h-[800px] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 py-12 lg:py-20 items-center">
          {/* Left clearance (58-66% width) so the dish & droplets shine completely unobstructed */}
          <div className="hidden lg:block lg:col-span-7 xl:col-span-7 pointer-events-none" />

          {/* Right column: Editorial copy shifted further right */}
          <div className="lg:col-span-5 xl:col-span-5 flex lg:justify-end">
            <div className="max-w-lg lg:ml-auto lg:translate-x-6 xl:translate-x-12 bg-white/95 sm:bg-white/90 lg:bg-transparent backdrop-blur-[2px] lg:backdrop-blur-none p-5 sm:p-8 lg:p-0 rounded-2xl lg:rounded-none shadow-sm lg:shadow-none">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#162e21]/70 font-sans">
              The Mile Infinity Approach
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-normal leading-[1.14] text-[#162e21]">
              Nature, thoughtfully<br />
              <span className="italic">formulated.</span>
            </h2>

            <p className="mt-5 sm:mt-6 text-xs sm:text-base leading-relaxed text-[#2c3d33]/85 font-sans">
              Mile Infinity brings together botanical ingredients and modern skincare thinking to
              create everyday rituals designed around care, nourishment and skin wellness.
            </p>

            <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/70 font-sans">
              Our herbal skincare perspective looks to beetroot, mulberry, avocado, green tea,
              white tea, chamomile, lavender, rosemary and calendula—alongside vitamins C and E—as
              inspiration for a considered daily ritual.
            </p>

            <div className="mt-6 sm:mt-8 pt-2">
              <a
                href="#botanicals"
                className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase text-[#162e21] border-b border-[#162e21]/40 pb-1.5 transition-all hover:border-[#162e21] hover:gap-4"
              >
                <span>Learn More About Botanical Skincare</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
 * 5. Two Brands, One Purpose Ecosystem Section — Exactly recreates Slide 3:
 * - Header: "TWO BRANDS. ONE PURPOSE."
 * - Heading: "A complete wellness ecosystem for a more beautiful you."
 * - Left: Navtaksh Wellness logo, "Nine Dimensions. One Complete You.", full highlighted 9 dimensions
 * - Center: Golden Infinity Spa Nature & Radiance visual
 * - Right: Mile Infinity logo, "Skincare for Modern Rituals.", full highlighted modern rituals text
 * - CRITICAL: Left logo and Right logo share the exact same height container and items-start alignment so they align horizontally with zero offset!
 */
function TwoBrandsEcosystem() {
  const nineDimensions = [
    "Physical",
    "Mental",
    "Emotional",
    "Spiritual",
    "Social",
    "Environmental",
    "Financial",
    "Nutritional",
    "Professional",
  ];

  const ritualPillars = [
    "Plant-Powered",
    "Active Botanicals",
    "Clean Formulations",
    "Conscious Care",
  ];

  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-28 border-t border-[#ede7dc]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16 overflow-x-hidden">
        {/* Header matching screenshot */}
        <Reveal direction="up" className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#162e21]/75 font-sans">
            TWO BRANDS. ONE PURPOSE.
          </p>
          <div className="w-10 h-[1.5px] bg-[#c29653] mx-auto mt-2 mb-5" />

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.12] text-[#162e21]">
            A complete wellness ecosystem<br />
            <span className="italic text-[#b88e4d] font-normal">for a more beautiful you.</span>
          </h2>

          <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-[#2c3d33]/80 font-sans max-w-xl mx-auto">
            NavTaksh Wellness is a holistic wellness company inspired by nature, rooted in tradition,
            and created for modern life. Mile Infinity is its skincare expression — bringing the wisdom
            of wellness into modern, effective skincare.
          </p>
        </Reveal>

        {/* 3-Column Bridge Ecosystem matching screenshot with PERFECT SAME LOGO ALIGNMENT */}
        <div className="mt-12 sm:mt-16 grid gap-8 lg:gap-6 grid-cols-1 lg:grid-cols-12 items-start">
          {/* Left Column: Navtaksh Wellness */}
          <Reveal direction="right" delay={150} className="lg:col-span-3 flex flex-col min-w-0">
            {/* Logo Container - Exact same height (h-20 sm:h-24) as right logo for perfect vertical alignment */}
            <div className="h-20 sm:h-24 flex items-center justify-center lg:justify-start">
              <img
                src={navtakshLogo}
                alt="NavTaksh Wellness — नव आयामेषु सम्पूर्ण कल्याणम्"
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Highlighted Card Container matching Image 3 */}
            <div className="mt-6 bg-[#faf8f5]/90 border border-[#e8dfcf] p-5 sm:p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#c29653]/40 overflow-visible">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#c29653]/15 text-[#966b2e] mb-3">
                <Sparkles className="w-3 h-3" /> Holistic Wellness
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#162e21] leading-snug">
                Nine Dimensions.<br />
                <span className="italic text-[#b88e4d]">One Complete You.</span>
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-[#2c3d33]/90 font-sans">
                NavTaksh Wellness embraces a holistic approach to well-being through nine interconnected dimensions:
              </p>

              {/* 9 Dimensions Highlighted Pills Grid */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {nineDimensions.map((dim) => (
                  <span
                    key={dim}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#ded4c3] text-[#162e21] shadow-2xs"
                  >
                    {dim}
                  </span>
                ))}
              </div>

              <p className="mt-3.5 pt-3 border-t border-[#162e21]/10 text-[11px] leading-relaxed text-[#2c3d33]/80 font-sans italic">
                "Each dimension contributes to a more balanced, fulfilling life, reflecting our belief that true wellness goes beyond skincare to nurture the whole person."
              </p>
            </div>
          </Reveal>

          {/* Center Column: The Golden Infinity Nature & Radiance Visual */}
          <Reveal direction="up" delay={250} className="lg:col-span-6 flex justify-center items-center py-2 sm:py-4 lg:py-0 self-center">
            <div className="relative w-full max-w-xs sm:max-w-lg lg:max-w-xl xl:max-w-2xl group mx-auto">
              <div className="relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.02] animate-float-gentle">
                <img
                  src={goldenInfinityImg}
                  alt="Golden Infinity Spa — Nature on the left, Radiance on the right"
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </div>
          </Reveal>

          {/* Right Column: Mile Infinity */}
          <Reveal direction="left" delay={350} className="lg:col-span-3 flex flex-col min-w-0">
            {/* Logo Container - Exact same height (h-20 sm:h-24) as left logo for perfect vertical alignment */}
            <div className="h-20 sm:h-24 flex items-center justify-center lg:justify-start">
              <img
                src={logoSvg}
                alt="Mile Infinity"
                className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = mileInfinityLogo;
                }}
              />
            </div>

            {/* Highlighted Card Container matching Image 3 */}
            <div className="mt-6 bg-[#faf8f5]/90 border border-[#e8dfcf] p-5 sm:p-6 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#163729]/40">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#163729]/12 text-[#163729] mb-3">
                <Leaf className="w-3 h-3" /> Botanical Skincare
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#162e21] leading-snug">
                Skincare for<br />
                <span className="italic text-[#163729]">Modern Rituals.</span>
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-[#2c3d33]/90 font-sans">
                Mile Infinity transforms the wisdom of wellness into thoughtfully formulated, conscious and effective skincare for your everyday rituals.
              </p>

              {/* Ritual Pillars Highlighted Pills */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {ritualPillars.map((pillar) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#163729]/8 border border-[#163729]/20 text-[#163729] shadow-2xs"
                  >
                    {pillar}
                  </span>
                ))}
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#162e21]/10">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#163729] hover:text-[#0c2217] transition-all group"
                >
                  <span>Explore Skincare Essentials</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * 5. Shop The Essentials Catalog & Hero Product Showcase on Home Page:
 * - Anchors id="essentials" so clicking "Shop Skincare" from hero scrolls smoothly here!
 * - Displays the full collection of essentials + hero product
 * - Directly matches the design in Image 1
 */
function HomeEssentialsSection({ products }: { products: ProductDto[] }) {
  const { add } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (p: ProductDto) => {
    add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      size: p.sizes?.[0] || "30ml",
      priceInr: p.priceInr,
      imageUrl: p.imageUrl,
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="essentials" className="bg-[#f7f5ef] py-16 lg:py-24 border-t border-[#ede7dc]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Header row from Group 24 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#162e21]/15 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162e21]/10 text-[#162e21] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3 h-3 text-[#c49838]" /> Daily Botanical Rituals
            </div>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#162e21] leading-tight">
              Your everyday skincare ritual.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.16em] font-normal text-[#162e21]/70 font-sans sm:text-right">
              {products.length} products
            </span>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:underline inline-flex items-center gap-1.5"
            >
              <span>View Full Shop</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid matching Screenshot 1 */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch">
          {products.map((p) => {
            const isAdded = addedId === p.id;
            const isHero = p.slug.includes("hero") || p.name.includes("Hero");
            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between bg-white/80 hover:bg-white p-4 transition-all duration-300 border border-[#e5dfd5]/85 hover:shadow-xl rounded-none"
              >
                <div>
                  {/* Artwork image */}
                  <Link
                    to="/product"
                    search={{ slug: p.slug }}
                    className="aspect-[4/5] overflow-hidden bg-[#faf8f4] flex items-center justify-center relative block cursor-pointer"
                  >
                    {isHero ? (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-[#162e21] text-[#c49838] border border-[#c49838]/40 px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#c49838]" /> Hero Product
                      </span>
                    ) : (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 text-[#162e21] px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase shadow-xs">
                        {p.category.toUpperCase()}
                      </span>
                    )}

                    <img
                      src={p.imageUrl || cardGreenImg}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Details */}
                  <div className="mt-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b7b6c] font-sans">
                      {p.category}
                    </span>
                    <h3 className="mt-1.5 font-serif text-base sm:text-[17px] font-normal text-[#162e21] leading-snug min-h-[2.75rem] line-clamp-2">
                      <Link to="/product" search={{ slug: p.slug }} className="hover:underline">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-[#2c3d33]/80 leading-relaxed font-sans min-h-[2.5rem] line-clamp-2">
                      {p.tagline || p.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#ede7dc]">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-serif text-lg font-bold text-[#162e21]">
                      {formatInr(p.priceInr)}
                    </span>
                    <Link
                      to="/product"
                      search={{ slug: p.slug }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:underline"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      to="/product"
                      search={{ slug: p.slug }}
                      className="w-full bg-white hover:bg-[#f7f5ef] text-[#162e21] py-2.5 px-3 text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm border-2 border-[#162e21] active:scale-95 cursor-pointer text-center"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-[#162e21]" />
                      <span>Buy Now</span>
                      <span className="text-[11px] font-normal text-[#162e21]/75">({formatInr(p.priceInr)})</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="w-full bg-[#162e21] hover:bg-[#0c2217] text-white py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 rounded-none shadow-sm cursor-pointer"
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
      </div>
    </section>
  );
}

/**
 * 6. Interactive Two Essentials Bundle Builder — Exactly recreates Slide 4 (Group 23):
 * - Top Left: "THE ART OF PAIRING", "Two essentials. One personal ritual."
 * - Top Right: "Bring your everyday essentials together..." + "YOUR ESSENTIALS PAIR/CHOOSE FITTING"
 * - Two Product Cards on stone plinths with floating "+" button
 * - Right sand card: "Choose your two." + "2 OF 2 SELECTED", 4 items, live total, and "ADD YOUR RITUAL TO BAG  →"
 */
function BundleBuilder() {
  const { add } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>(["prod-1", "prod-2"]);
  const [added, setAdded] = useState(false);

  const bundleCatalog = [
    {
      id: "prod-1",
      slug: "crimson-beauty-beetroot-facewash",
      categoryStep: "01 / CLEANSE",
      stepName: "Cleanse",
      shortName: "Beetroot",
      name: "Mile Infinity Crimson Beauty Beetroot Facewash",
      priceInr: 899,
      size: "100ml",
      cardImage: cardBeetrootImg,
    },
    {
      id: "prod-2",
      slug: "ceremonial-green-fusion-serum",
      categoryStep: "02 / TREAT",
      stepName: "Treat",
      shortName: "Green fusion",
      name: "Mile Infinity Ceremonial Green Fusion Serum",
      priceInr: 1699,
      size: "30ml",
      cardImage: cardGreenImg,
    },
    {
      id: "prod-3",
      slug: "blueberry-lavender-bliss-moisturiser",
      categoryStep: "03 / HYDRATE",
      stepName: "Hydrate",
      shortName: "Blueberry & Lavender",
      name: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
      priceInr: 1299,
      size: "50ml",
      cardImage: cardBlueberryImg,
    },
    {
      id: "prod-4",
      slug: "sunnykiss-radiance-spf-sunscreen",
      categoryStep: "04 / PROTECT",
      stepName: "Protect",
      shortName: "Radiance SPF",
      name: "Mile Infinity Sunshine Radiance SPF 50 Sunscreen",
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
      if (prev.length >= 2) {
        const first = prev[0];
        return first ? [first, id] : [id];
      }
      return [...prev, id];
    });
    setAdded(false);
  }

  const selectedItems = bundleCatalog.filter((item) => selectedIds.includes(item.id));
  const card1 = selectedItems[0] ?? bundleCatalog[0]!;
  const card2 = selectedItems[1] ?? bundleCatalog[1]!;
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.priceInr, 0);
  const ritualTitle = selectedItems.map((i) => i.stepName).join(" + ");

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
      {/* Cinematic Emerald Arc Background Image from Figma */}
      <img
        src={cinematicEmeraldBg}
        alt="Cinematic Emerald Arc Abstract Background"
        className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#06170f]/35 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Top Header from Slide 4 */}
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
              Pair any two products for a bundled price of ₹2,598.
            </p>
          </div>
        </div>

        {/* Dual Cards + Selector Card from Slide 4 */}
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left/Center Visual: Two large cards on stone plinths with floating "+" symbol */}
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

            {/* Floating "+" Button exactly as in Group 23 */}
            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f5f0] text-[#162e21] shadow-xl border border-white/60 my-[-8px] sm:my-0 animate-float">
              <span className="text-xl font-light leading-none">+</span>
            </div>

            {/* Card 2 */}
            <div className="w-full sm:w-1/2 max-w-[260px] sm:max-w-[280px] overflow-hidden bg-[#f7f5f0] shadow-2xl transition-transform duration-500 hover:scale-[1.02] border border-white/20">
              <div className="aspect-[4/5] overflow-hidden bg-[#e8e4db] flex items-center justify-center">
                <img
                  src={card2.cardImage}
                  alt={card2.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
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

          {/* Right Column: "Choose your two." sand card from Slide 4 */}
          <div className="lg:col-span-5 bg-[#f4f1ea] p-4 sm:p-6 lg:p-8 text-[#162e21] shadow-2xl border border-[#ded8cb]">
            <div className="flex items-center justify-between border-b border-[#ded8cb] pb-3.5 sm:pb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-[#162e21]">
                  Choose your two.
                </h3>
                <p className="mt-1 text-xs text-[#2c3d33]/70 font-sans">
                  Select 2 products from the list below to create your pairing.
                </p>
              </div>
              <span className="border border-[#162e21]/40 px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.18em] text-[#162e21] shrink-0">
                PAIR BENEFITS
              </span>
            </div>

            {/* 4 Items in the selector */}
            <div className="mt-3.5 sm:mt-4 space-y-2">
              {bundleCatalog.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={`flex w-full items-center gap-2.5 sm:gap-3.5 p-2 sm:p-3 text-left transition-all duration-300 active:scale-98 hover-lift-sm ${
                      isSelected
                        ? "bg-[#dfe5da] ring-1 ring-[#162e21]/20 shadow-sm"
                        : "bg-transparent hover:bg-white/40"
                    }`}
                  >
                    <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden bg-white p-0.5 border border-[#ded7cb]">
                      <img
                        src={item.cardImage}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
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
                        className={`flex h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isSelected
                            ? "border-[#1a382b] bg-[#1a382b] text-white scale-105"
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

            {/* Bottom calculation and CTA from Slide 4 */}
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
                  <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-[#162e21]">
                    {formatInr(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddRitual}
                disabled={selectedIds.length !== 2}
                className="btn-shimmer hover-lift active:scale-95 mt-4 sm:mt-5 w-full bg-[#1b3b2d] hover:bg-[#122c21] py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition-all flex items-center justify-between px-5 sm:px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {added ? (
                  <span className="inline-flex items-center gap-2 text-emerald-300 animate-scale-in">
                    <CheckCircle2 className="h-4 w-4" /> Ritual Added to Bag!
                  </span>
                ) : (
                  <>
                    <span>Add Your Ritual to Bag</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
 * 7. Spotlight Daily Skincare Essential — Exactly recreates Slide 5:
 * - Uses Luxury Matcha Tea Skincare Still Life 1.png
 * - Left side shows model with wet luminous skin, arch, serum bottle, avocado, and green tea
 * - Right side shows:
 *   "THE RITUAL STARTS HERE"
 *   "Meet your daily skincare essential."
 *   "Mile Infinity Ceremonial Green Fusion Serum"
 *   "Part of Mile Infinity's plant-based skincare range..."
 *   3 lines with hyphens:
 *     — Face serum for the treatment step
 *     — Green tea-inspired botanical positioning
 *     — Designed for an everyday skincare ritual
 *   Price: ₹1,599
 *   Button: ADD TO CART (with bag icon)
 */
function SpotlightMatchaSection() {
  const { add } = useCart();

  return (
    <section className="relative w-full overflow-hidden bg-[#f9ecdf]">
      <div className="relative min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] xl:min-h-[820px] w-full flex items-center">
        {/* Full width background image from Slide 5 — pinned to left so model & bottle stay on left */}
        <img
          src={luxuryMatchaStillLifeImg}
          alt="Mile Infinity Ceremonial Green Fusion Serum — Model & Botanical Still Life"
          className="absolute inset-0 h-full w-full object-cover object-left select-none pointer-events-none"
        />

        {/* Soft overlay on mobile screens only for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9ecdf] via-[#f9ecdf]/75 to-transparent lg:hidden pointer-events-none" />

        {/* Layout container pushing text firmly to the right side */}
        <div className="relative z-10 mx-auto max-w-[1600px] 2xl:max-w-[1760px] px-5 sm:px-10 lg:px-16 xl:px-20 w-full py-12 sm:py-16 lg:py-20 flex items-center justify-end">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left 7-8 columns clearance for model, bottle, avocado & botanical still life */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-7 2xl:col-span-7 pointer-events-none" />

            {/* Right columns: Editorial copy shifted firmly to the right side */}
            <Reveal direction="up" delay={150} className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 max-w-md sm:max-w-lg lg:max-w-xl ml-auto lg:pl-12 xl:pl-16 2xl:pl-24 lg:translate-x-6 xl:translate-x-12 bg-[#f9ecdf]/92 sm:bg-[#f9ecdf]/60 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-5 sm:p-8 lg:p-0 rounded-2xl lg:rounded-none shadow-sm lg:shadow-none">
              <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#162e21]/75 font-sans">
                The Ritual Starts Here
              </p>

              <h2 className="mt-2.5 font-serif text-2xl sm:text-3xl lg:text-[40px] xl:text-[46px] font-medium leading-[1.12] text-[#162e21]">
                Meet your daily<br />
                <span className="italic font-normal">skincare essential.</span>
              </h2>

              <h3 className="mt-3.5 font-serif text-lg sm:text-xl font-normal text-[#162e21]">
                Mile Infinity Ceremonial Green Fusion Serum
              </h3>

              <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/85 font-sans">
                Part of Mile Infinity's plant-based skincare range, this face serum is inspired by
                ceremonial green botanicals and fits naturally between cleansing and moisturising.
              </p>

              {/* 3 Checklist lines with hyphens from Slide 5 */}
              <div className="mt-5 space-y-2.5 pt-3.5 border-t border-[#162e21]/15 text-xs sm:text-sm text-[#2c3d33]/85 font-sans">
                <div className="flex items-center gap-3">
                  <span className="text-[#162e21] font-medium">—</span>
                  <span>Face serum for the treatment step</span>
                </div>
                <div className="flex items-center gap-3 pt-2.5 border-t border-[#162e21]/10">
                  <span className="text-[#162e21] font-medium">—</span>
                  <span>Green tea-inspired botanical positioning</span>
                </div>
                <div className="flex items-center gap-3 pt-2.5 border-t border-[#162e21]/10">
                  <span className="text-[#162e21] font-medium">—</span>
                  <span>Designed for an everyday skincare ritual</span>
                </div>
              </div>

              {/* Price & Add to Cart button from Slide 5 */}
              <div className="mt-6 sm:mt-7 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-8">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-[#162e21]">
                  ₹1,699
                </span>

                <button
                  type="button"
                  onClick={() =>
                    add({
                      productId: "prod-2",
                      slug: "ceremonial-green-fusion-serum",
                      name: "Mile Infinity Ceremonial Green Fusion Serum",
                      size: "30ml",
                      priceInr: 1699,
                      imageUrl: cardGreenImg,
                    })
                  }
                  className="btn-shimmer hover-lift active:scale-95 inline-flex items-center justify-center gap-3 bg-[#1a382b] hover:bg-[#12291f] text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all rounded-none shadow-md w-full sm:w-auto"
                >
                  <span>Add to Cart</span>
                  <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 8A. Botanical Inspiration / Rooted in Nature — Matching exact section from screenshot:
 * - Left: 4 bottles in sunlit forest photo (sunlitForestBottlesImg)
 * - Right:
 *     - "ROOTED IN NATURE"
 *     - "Botanical inspiration. Thoughtful everyday care."
 *     - Subtitle paragraph
 *     - 3 Rows: Beetroot, Green tea, Blue berry & lavender
 *     - Footnote about clean purposeful skincare without parabens
 */
function BotanicalInspirationSection() {
  return (
    <section className="bg-[#f7f5ef] py-20 lg:py-28 border-t border-[#ede7dc]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: 4 bottles in sunlit forest */}
          <div className="lg:col-span-5 relative overflow-hidden shadow-lg border border-[#e5dfd5]/80">
            <img
              src={sunlitForestBottlesImg}
              alt="Mile Infinity Skincare in Sunlit Forest"
              className="w-full h-auto object-cover select-none"
            />
          </div>

          {/* Right: Rooted in nature copy & 3 botanical rows */}
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Rooted in Nature
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.15] text-[#162e21]">
              Botanical inspiration. Thoughtful<br />everyday care.
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/80 font-sans max-w-xl">
              Mile Infinity develops elegant, botanical-first formulas designed to elevate everyday skincare.
              A considered, calibrated collection that meets your skin where it lives, with calm, daily reverence.
            </p>

            <div className="mt-8 divide-y divide-[#162e21]/15 border-y border-[#162e21]/15">
              <div className="py-3.5 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-4 sm:items-center">
                <span className="sm:col-span-4 lg:col-span-3 font-serif text-base sm:text-lg text-[#162e21] font-normal">
                  Beetroot
                </span>
                <p className="sm:col-span-8 lg:col-span-9 text-xs sm:text-sm text-[#2c3d33]/80 font-sans leading-relaxed">
                  Deep, earthy nourishment for daily cleansing and natural brightness.
                </p>
              </div>

              <div className="py-3.5 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-4 sm:items-center">
                <span className="sm:col-span-4 lg:col-span-3 font-serif text-base sm:text-lg text-[#162e21] font-normal">
                  Green tea
                </span>
                <p className="sm:col-span-8 lg:col-span-9 text-xs sm:text-sm text-[#2c3d33]/80 font-sans leading-relaxed">
                  A concentrated botanical extract rich in antioxidants for lasting skin calm.
                </p>
              </div>

              <div className="py-3.5 sm:py-4.5 flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-4 sm:items-center">
                <span className="sm:col-span-4 lg:col-span-3 font-serif text-base sm:text-lg text-[#162e21] font-normal">
                  Blue berry &amp; lavender
                </span>
                <p className="sm:col-span-8 lg:col-span-9 text-xs sm:text-sm text-[#2c3d33]/80 font-sans leading-relaxed">
                  Nourishing botanical blend for barrier protection and deep ease.
                </p>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-[#2c3d33]/65 font-sans leading-relaxed">
              All products are formulated without parabens, phthalates, synthetic dyes, or harsh sulfates. Clean, purposeful skincare you can return to every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 8B. Thoughtful care. Everyday beauty. Formulation Standards 3-column banner:
 * - Header: "Thoughtful care. Everyday beauty." and "EXPLORE OUR FORMULATION STANDARDS →"
 * - 3 Columns: Botanical-inspired, Not tested on animals, A considered ritual
 */
function FormulationStandardsBanner() {
  return (
    <section className="bg-[#0e2a1e] py-12 lg:py-16 text-white border-t border-[#16382b]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Thoughtful care. Everyday beauty.
          </h3>
          <a
            href="#botanicals"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a4c2b0] hover:text-white inline-flex items-center gap-2 transition-colors"
          >
            <span>Explore Our Formulation Standards</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-950/40 text-emerald-200">
              <Leaf className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-white font-normal">Botanical-inspired</h4>
              <p className="mt-1.5 text-xs text-white/75 font-sans leading-relaxed">
                Pure extracts paired with purposeful, effective cosmetic science.
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
                Cruelty-free development and respect for all living things at every step.
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
                Four intentional daily steps for thoughtful, uncomplicated care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 9. The Four-Step Edit — Matching Botanical Skincare Ingredient Collage 1.png
 */
function FourStepEditSection() {
  const { add } = useCart();

  const steps = [
    {
      stepLabel: "STEP 01",
      stepNum: "01",
      title: "Cleanse",
      productName: "Crimson Beauty Beetroot Facewash",
      image: cropStep01,
      id: "prod-1",
      slug: "crimson-beauty-beetroot-facewash",
      size: "100ml",
      priceInr: 899,
    },
    {
      stepLabel: "STEP 02",
      stepNum: "02",
      title: "Treat",
      productName: "Ceremonial Green Fusion Serum",
      image: cropStep02,
      id: "prod-2",
      slug: "ceremonial-green-fusion-serum",
      size: "30ml",
      priceInr: 1699,
    },
    {
      stepLabel: "STEP 03",
      stepNum: "03",
      title: "Moisturise",
      productName: "Blue Berry & Lavender Bliss Moisturiser",
      image: cropStep03,
      id: "prod-3",
      slug: "blueberry-lavender-bliss-moisturiser",
      size: "50ml",
      priceInr: 1299,
    },
    {
      stepLabel: "STEP 04",
      stepNum: "04",
      title: "Protect",
      productName: "Sunshine Radiance SPF 50 Sunscreen",
      image: cropStep04,
      id: "prod-4",
      slug: "sunnykiss-radiance-spf-sunscreen",
      size: "100ml",
      priceInr: 1299,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0c281e] py-20 lg:py-28 text-[#f7f5f0] border-t border-[#16382b]">
      {/* Background Botanical Ingredient Collage from user image */}
      <img
        src={botanicalCollageImg}
        alt="Botanical Skincare Ingredient Collage"
        className="absolute inset-0 h-full w-full object-cover object-right opacity-35 lg:opacity-45 select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c281e] via-[#0c281e]/85 to-[#0c281e]/40 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column from Slide 1 / Screenshot 4 */}
          <Reveal direction="right" className="lg:col-span-4 lg:border-r lg:border-white/15 lg:pr-10 xl:pr-12">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#c29653]">
              The Four-Step Edit
            </p>

            <h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] text-white">
              Build your<br />
              <span className="italic font-normal">ritual.</span>
            </h2>

            <p className="mt-5 text-xs sm:text-sm leading-relaxed text-white/80 font-sans max-w-sm">
              A considered routine,<br />made refreshingly simple.
            </p>

            <div className="mt-8">
              <a
                href="#shop-catalog"
                className="btn-shimmer hover-lift active:scale-95 inline-flex items-center gap-3 bg-[#f4f1ea] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21] shadow-lg transition-transform hover:bg-white rounded-none"
              >
                <span>Shop The Routine</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          {/* Right Column: 4 Step Rows from Slide 1 / Screenshot 4 */}
          <div className="lg:col-span-8 divide-y divide-white/15 border-y border-white/15">
            {steps.map((s, idx) => (
              <Reveal
                key={s.stepNum}
                direction="up"
                delay={idx * 90}
                className="py-4 sm:py-6 flex items-center justify-between gap-3 sm:gap-6 group transition-all duration-300 hover:bg-white/[0.05] px-3 -mx-3 rounded-lg"
              >
                {/* Step Num + Vertical bar */}
                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                  <div>
                    <span className="block text-[8px] sm:text-[9px] font-semibold tracking-widest text-[#c29653] uppercase">
                      {s.stepLabel}
                    </span>
                    <span className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#d4af37] font-normal leading-none">
                      {s.stepNum}
                    </span>
                  </div>
                  <span className="h-8 sm:h-10 w-[1px] bg-white/20 ml-1 sm:ml-2" />
                </div>

                {/* Title + Subtext positioned directly over the background collage */}
                <div className="flex-1 min-w-0 pl-1 sm:pl-4">
                  <h4 className="font-serif text-lg sm:text-2xl text-white font-normal truncate group-hover:text-emerald-200 transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/80 font-sans truncate mt-0.5">
                    {s.productName}
                  </p>
                </div>

                {/* Right Arrow Outline Circle Button */}
                <div className="shrink-0 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      add({
                        productId: s.id,
                        slug: s.slug,
                        name: s.productName,
                        size: s.size,
                        priceInr: s.priceInr,
                        imageUrl: s.image,
                      })
                    }
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/30 text-white/80 transition-all duration-200 group-hover:border-white group-hover:text-white group-hover:bg-white/15 group-hover:scale-110 active:scale-90"
                    title={`Add ${s.title} to bag`}
                  >
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 10. Powered by Botanicals Active Ingredients Table
 */
function PoweredByBotanicalsSection() {
  const botanicals = [
    {
      id: "01",
      name: "Beetroot Extract",
      latin: "Beta Vulgaris",
      benefit: "Radiance & Cellular Revitalization",
      desc: "Rich in active betalains, nitrates, and vitamin C that enhance microcirculation and restore natural skin brightness.",
    },
    {
      id: "02",
      name: "White Mulberry",
      latin: "Morus Alba",
      benefit: "Tone Clarifying & Antioxidant Defense",
      desc: "Known in traditional herbalism to calm uneven pigmentation and protect against environmental oxidative damage.",
    },
    {
      id: "03",
      name: "Japanese Green Tea & White Tea",
      latin: "Camellia Sinensis",
      benefit: "Calm Redness & Skin Balance",
      desc: "Abundant in EGCG polyphenols that regulate sebum, reduce inflammation, and soothe environmental stress.",
    },
    {
      id: "04",
      name: "Wild Blueberry & French Lavender",
      latin: "Vaccinium & Lavandula",
      benefit: "Deep Barrier Hydration & Serenity",
      desc: "Delivers restorative barrier lipids and calming terpenes to support suppleness and nighttime recovery.",
    },
    {
      id: "05",
      name: "Cold-Pressed Avocado Oil",
      latin: "Persea Gratissima",
      benefit: "Elasticity & Moisture Retention",
      desc: "Packed with essential oleic fatty acids and phytosterols to soften rough texture and fortify the acid mantle.",
    },
  ];

  return (
    <section id="botanicals" className="bg-[#faf8f4] py-20 lg:py-28 border-t border-[#ede7dc]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#162e21]/70">
            Conscious Ingredients
          </p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-medium leading-tight text-[#162e21]">
            Nature has its own intelligence.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#2c3d33]/80">
            Every plant extract is thoughtfully chosen for biocompatibility, concentrated purity,
            and gentle efficacy in your everyday routine.
          </p>
        </div>

        <div className="mt-12 divide-y divide-[#e5dfd5] border-y border-[#e5dfd5]">
          {botanicals.map((b) => (
            <div key={b.id} className="py-6 grid gap-4 md:grid-cols-12 md:items-center">
              <div className="md:col-span-1 text-xs font-semibold tracking-widest text-[#162e21]/40">
                {b.id}
              </div>
              <div className="md:col-span-4">
                <h3 className="font-display text-xl sm:text-2xl font-medium text-[#162e21]">
                  {b.name}
                </h3>
                <p className="text-xs italic text-[#2c3d33]/60">{b.latin}</p>
              </div>
              <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-[#c49838]">
                {b.benefit}
              </div>
              <div className="md:col-span-4 text-xs sm:text-sm text-[#2c3d33]/75 leading-relaxed font-sans">
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SparkleStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3c0 4.5-2 7.5-6.5 9 4.5 1.5 6.5 4.5 6.5 9 0-4.5 2-7.5 6.5-9-4.5-1.5-6.5-4.5-6.5-9z" />
    </svg>
  );
}

function BunnyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 14c-1.5 0-3 1-3 2.5 0 2 2 3.5 5 3.5s5-1.5 5-3.5c0-1.5-1.5-2.5-3-2.5" />
      <path d="M14 14c1-1 2-3 1.5-6.5s-2.5-3.5-3.5-1c-.5 1-1 3-1 4.5" />
      <path d="M10 14c-1-1-2-3-1.5-6.5s2.5-3.5 3.5-1c.5 1 1 3 1 4.5" />
      <circle cx="11" cy="16" r=".8" fill="currentColor" />
      <circle cx="13" cy="16" r=".8" fill="currentColor" />
    </svg>
  );
}

/**
 * 11. Why Mile Infinity — Exactly recreates Slide 2 / Screenshot 3:
 * - Dewy Matcha Serum in a Lush Forest background
 * - Left: "WHY MILE INFINITY", "Thoughtful care. Everyday beauty.", description
 * - Right: 4 rows: 01 Plant-based, 02 Conscious, 03 Quality, 04 Cruelty-free
 */
function WhyMileInfinitySection() {
  const pillars = [
    {
      num: "01",
      icon: Sprout,
      title: "Plant-based",
      desc: "Botanical-inspired formulations.",
    },
    {
      num: "02",
      icon: Heart,
      title: "Conscious",
      desc: "Skincare designed around intentional everyday care.",
    },
    {
      num: "03",
      icon: SparkleStarIcon,
      title: "Quality",
      desc: "A focus on thoughtful product formulation and experience.",
    },
    {
      num: "04",
      icon: BunnyIcon,
      title: "Cruelty-free",
      desc: "Mile Infinity states that its products are not tested on animals.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0d2218] py-20 lg:py-28 xl:py-32 text-white">
      {/* Background Forest Image from Slide 2 */}
      <img
        src={dewyMatchaForestImg}
        alt="Mile Infinity Matcha Tea Serum in a Lush Forest"
        className="absolute inset-0 h-full w-full object-cover object-[25%_center] sm:object-[28%_center] lg:object-[32%_center] opacity-90 lg:opacity-95 select-none pointer-events-none"
      />

      {/* Text protection gradient: ensures the typography stays crisp with zero bottle overlap */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-3/5 lg:w-1/2 bg-gradient-to-r from-[#0d2218] via-[#0d2218]/85 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2218]/90 via-transparent to-transparent sm:hidden pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-12 lg:items-start">
          {/* Left Title Copy with constrained max-width so it never touches the bottle */}
          <div className="lg:col-span-5 max-w-[310px] sm:max-w-xs lg:max-w-sm lg:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c4af78] font-sans">
              Why Mile Infinity
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-[44px] xl:text-[48px] font-normal leading-[1.12] text-white">
              Thoughtful care.<br />
              <span className="italic font-normal">Everyday beauty.</span>
            </h2>
            <p className="mt-4 sm:mt-5 text-xs sm:text-[13px] leading-relaxed text-white/85 font-sans max-w-[280px]">
              Skincare that's rooted in nature, crafted with care and made for your everyday rituals.
            </p>
          </div>

          {/* Right 4 Horizontal Rows from Screenshot — Mobile Responsive */}
          <div className="lg:col-span-7 divide-y divide-white/10 border-y border-white/10 lg:mt-2">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 lg:gap-6 group"
              >
                {/* Top sub-row on mobile */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  {/* Number */}
                  <span className="text-xs sm:text-sm font-sans text-[#c4af78]/80 w-5 sm:w-6 shrink-0 font-light">
                    {p.num}
                  </span>

                  {/* Circular Icon Badge */}
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-[#c4af78]/40 bg-[#0e2c1e]/60 text-[#c4af78] shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <p.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.4} />
                  </div>

                  {/* Title */}
                  <div className="sm:min-w-[140px] lg:min-w-[170px] shrink-0">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-[27px] font-normal text-white">
                      {p.title}
                    </h3>
                  </div>
                </div>

                {/* Vertical Divider Line on sm+ */}
                <div className="hidden sm:block h-7 sm:h-8 w-[1px] bg-white/20 shrink-0" />

                {/* Description */}
                <div className="pl-8 sm:pl-0 flex-1 min-w-0">
                  <p className="text-xs sm:text-[13px] text-white/80 font-sans leading-relaxed max-w-[280px]">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 12. Find Your Skincare Ritual ("Where does your routine begin?") — Exactly recreates Figma design:
 * - Kicker: "FIND YOUR SKINCARE RITUAL"
 * - Headline: "Where does your routine begin?" (italic serif on second line)
 * - Subtitle: "Discover the products that fit naturally into your everyday routine."
 * - Left 4 Tabs: 01 Cleanse, 02 Treat, 03 Moisturise, 04 Protect with active card styling
 * - Right Visual: Arched model holding Beetroot Facewash with botanical ingredients, floating oil beads
 * - Floating Product Card: Category, Product Name, Price, and "FIND MY ROUTINE →" action
 */
function RoutineFinderSection() {
  const { add } = useCart();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const routineSteps = [
    {
      step: "01",
      name: "Cleanse",
      category: "FACE WASH",
      productName: "Mile Infinity Crimson Beauty Beetroot Facewash",
      priceInr: 899,
      slug: "crimson-beauty-beetroot-facewash",
      id: "prod-1",
      size: "100ml",
      image: cardBeetrootImg,
    },
    {
      step: "02",
      name: "Treat",
      category: "FACE SERUM",
      productName: "Mile Infinity Ceremonial Green Fusion Serum",
      priceInr: 1699,
      slug: "ceremonial-green-fusion-serum",
      id: "prod-2",
      size: "30ml",
      image: cardGreenImg,
    },
    {
      step: "03",
      name: "Moisturise",
      category: "MOISTURISER",
      productName: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
      priceInr: 1299,
      slug: "blueberry-lavender-bliss-moisturiser",
      id: "prod-3",
      size: "50ml",
      image: cardBlueberryImg,
    },
    {
      step: "04",
      name: "Protect",
      category: "SUNSCREEN",
      productName: "Mile Infinity Sunshine Radiance SPF 50 Sunscreen",
      priceInr: 1299,
      slug: "sunnykiss-radiance-spf-sunscreen",
      id: "prod-4",
      size: "100ml",
      image: cardSunscreenImg,
    },
  ];

  const current = routineSteps[activeStepIndex] ?? routineSteps[0]!;

  function handleAdd() {
    add({
      productId: current.id,
      slug: current.slug,
      name: current.productName,
      size: current.size,
      priceInr: current.priceInr,
      imageUrl: current.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <section id="routine-finder" className="relative w-full overflow-hidden bg-[#faf8f4] py-20 lg:py-28 text-[#162e21] border-t border-[#ede7dc]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & 4 Step Tabs */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#162e21]/70 font-sans">
              Find Your Skincare Ritual
            </p>

            <h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-[50px] font-normal leading-[1.12] text-[#162e21]">
              Where does your<br />
              <span className="italic font-normal">routine begin?</span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/80 font-sans max-w-md">
              Discover the products that fit naturally into your everyday routine.
            </p>

            {/* 4 Interactive Routine Tabs */}
            <div className="mt-8 space-y-2 max-w-sm">
              {routineSteps.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setAdded(false);
                    }}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-300 rounded-sm hover-lift-sm active:scale-98 ${
                      isActive
                        ? "bg-[#ede6dc] border-l-2 border-[#162e21] shadow-sm text-[#162e21]"
                        : "bg-transparent hover:bg-black/[0.04] border-b border-[#162e21]/10 text-[#162e21]/70"
                    }`}
                  >
                    <span className="text-xs font-mono opacity-60">{step.step}</span>
                    <span className="font-serif text-lg sm:text-xl font-normal capitalize">
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Model Arched Artwork & Floating Product Card */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              {/* Main Artwork with model in arched pill, droplets, beet, leaves */}
              <div className="relative overflow-hidden">
                <img
                  src={routineFinderArtworkImg}
                  alt="Mile Infinity Routine Finder — Model with Skincare Ritual"
                  className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.01]"
                />
              </div>

              {/* Dynamic Interactive Floating Product Card positioned gracefully on mobile and desktop */}
              <div className="mt-5 sm:mt-0 sm:absolute sm:-bottom-4 sm:right-4 z-20 w-full sm:w-72 max-w-sm mx-auto sm:mx-0 bg-white p-4 sm:p-6 shadow-xl rounded-2xl border border-[#ede7dc] hover-lift-sm animate-float-gentle transition-all">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#c29653]">
                  {current.category}
                </p>
                <h4 className="mt-1.5 sm:mt-2 font-serif text-base sm:text-lg font-medium text-[#162e21] leading-snug">
                  {current.productName}
                </h4>
                <p className="mt-2 sm:mt-3 font-serif text-base sm:text-lg font-semibold text-[#162e21]">
                  {formatInr(current.priceInr)}
                </p>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn-shimmer hover-lift active:scale-95 mt-3.5 sm:mt-4 w-full bg-[#1b3b2d] hover:bg-[#122c21] py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-md transition-all flex items-center justify-between px-4 rounded-none cursor-pointer"
                >
                  {added ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-300 animate-scale-in">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Added to Bag
                    </span>
                  ) : (
                    <>
                      <span>Find My Routine</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 13. Frequently Asked Questions — Matching Frame 6.png:
 * - Uses Frame 6 as background with sage silk, textured stone, and jasmine flower on the left
 * - Real interactive accordion on the right with all 8 questions
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

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full overflow-hidden bg-[#faf8f4] py-16 sm:py-20 lg:py-28 border-t border-[#ede7dc]">
      {/* Pristine serene stone spa background from master still life */}
      <img
        src={sereneStoneSpaBgImg}
        alt="Botanical silk and travertine still life"
        className="absolute inset-0 h-full w-full object-cover object-left lg:object-center select-none"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Heading */}
          <Reveal direction="right" className="lg:col-span-5 pt-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[#162e21]/75 font-semibold">
              Good to know
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[54px] font-normal leading-[1.14] text-[#162e21]">
              Frequently asked<br />
              <span className="italic">questions.</span>
            </h2>
            <p className="mt-3.5 sm:mt-4 max-w-sm text-xs sm:text-base text-[#2c3d33]/85 leading-relaxed font-sans">
              Everything you need to begin a simpler Mile Infinity skincare ritual.
            </p>
          </Reveal>

          {/* Right Column: Interactive Accordion */}
          <Reveal direction="left" delay={150} className="lg:col-span-7 divide-y divide-[#162e21]/20 border-y border-[#162e21]/20 sm:bg-transparent bg-[#fdfbf9]/90 sm:backdrop-blur-none backdrop-blur-xs rounded-2xl p-4 sm:p-0">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.q} className="py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-serif text-base sm:text-lg text-[#162e21] hover:text-[#0c2217] transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{faq.q}</span>
                    <span className={`text-xl font-light text-[#162e21] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-[#2c3d33]/85 font-sans pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * 14. Closing Luxury CTA Banner — Matching Frame 30.png:
 * - Full 1440x603 image featuring the two models holding moisturizer & serum
 * - Direct interactive buttons matching the exact layout
 */
function ClosingLuxuryBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#073125]">
      <div className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[603px] w-full flex items-center justify-center">
        {/* Clean full-width background photo without baked text */}
        <img
          src={radiantModelsDuoBgImg}
          alt="Mile Infinity — Your skin. Your ritual. Your Mile Infinity."
          className="absolute inset-0 h-full w-full object-cover object-center select-none"
        />

        {/* Center editorial typography and interactive buttons matching Frame 30 */}
        <Reveal direction="up" className="relative z-10 text-center px-4 max-w-2xl py-14 sm:py-20">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[46px] font-normal leading-[1.2] text-white">
            Your skin.<br />
            Your ritual.<br />
            <span className="italic">Your Mile Infinity.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-white/85 font-sans max-w-lg mx-auto leading-relaxed">
            Discover skincare designed to make everyday care feel more intentional.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
            <a
              href="#essentials"
              className="btn-shimmer hover-lift active:scale-95 bg-[#ede9e1] hover:bg-white text-[#162e21] px-6 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all inline-flex items-center justify-center gap-2 shadow-lg text-center"
            >
              <span>Shop All Skincare</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="#approach"
              className="btn-shimmer hover-lift active:scale-95 border border-white/70 hover:border-white bg-[#073125]/40 hover:bg-[#073125]/70 backdrop-blur-sm text-white px-6 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all inline-flex items-center justify-center gap-2 text-center"
            >
              <span>Explore The Brand</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
