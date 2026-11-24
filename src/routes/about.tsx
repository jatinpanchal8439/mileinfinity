import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { RunningTicker } from "@/components/running-ticker";

// High-resolution reference assets for the About Us / Our Story page
import playfulGlowTrioImg from "@/assets/playful-glow-skincare-trio.png";
import goldenSerumImg from "@/assets/golden-serum-approach.png";
import botanicalTriptychImg from "@/assets/botanical-editorial-triptych.png";
import staggeredFacewashImg from "@/assets/staggered-cleanse-facewash.png";
import staggeredSerumImg from "@/assets/staggered-treat-serum.png";
import staggeredMoisturiserImg from "@/assets/staggered-moisturise-cream.png";
import staggeredSunscreenImg from "@/assets/staggered-protect-sunscreen.png";
import closingBannerImg from "@/assets/closing-banner-frame-30.png";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    title: "Our Story — Rooted in Nature, Designed for Modern Rituals | Mile Infinity",
    meta: [
      {
        name: "description",
        content:
          "Discover Mile Infinity's thoughtful approach to everyday skincare, inspired by botanical ingredients and designed to bring a more intentional feel to your daily rituals.",
      },
      { property: "og:title", content: "Our Story — Mile Infinity Skincare" },
      {
        property: "og:description",
        content:
          "Skincare, Rooted in Nature. Designed for Modern Rituals. Four essentials, four distinct moments of care.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

export function AboutPage() {
  return (
    <PageShell>
      {/* 1. Hero Section matching Group 28.png — Full Width Edge-to-Edge */}
      <AboutHero />

      {/* 2. Sub-bar Intention Ribbon & Jump Links */}
      <AboutSubBar />

      {/* 2b. Running Ticker Carousel Strip */}
      <RunningTicker variant="dark" />

      {/* 3. Our Philosophy: Beauty Begins with Thoughtful Care */}
      <AboutPhilosophySection />

      {/* 4. Our Botanical Inspiration: Nature, Thoughtfully Considered (Dark Forest Green) */}
      <AboutBotanicalInspirationSection />

      {/* 5. The Mile Infinity Approach: Less Noise. More Thoughtful Care */}
      <AboutApproachSection />

      {/* 6. A Moment, Made Everyday: Make Time for Your Skin (Dark Green Ritual Sequence) */}
      <AboutRitualSequenceSection />

      {/* 7. The Everyday Collection: Discover Your Everyday Ritual (Staggered Gallery) */}
      <AboutEverydayCollectionSection />

      {/* 8. Closing Luxury Banner: Your skin. Your ritual. Your Mile Infinity. */}
      <AboutClosingBanner />
    </PageShell>
  );
}

/**
 * 1. Hero Section — Full-Width Screen Edge-to-Edge:
 * - Left: Story Headline & CTAs with responsive inset padding
 * - Right: Radiant model trio (Playful Glow Skincare Trio 1.png) flush against right screen edge
 * - Background: Seamless warm botanical tone (#eee3d5) matching the photo backdrop
 */
function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f4] lg:bg-[#eee3d5] border-b border-[#e5dfd5]">
      <div className="w-full flex flex-col lg:grid lg:grid-cols-12 min-h-0 lg:min-h-[680px] xl:min-h-[740px] 2xl:min-h-[800px] items-stretch">
        {/* Photo Container: Sits on TOP on mobile view (order-1), right side on desktop (order-2) */}
        <div className="order-1 lg:order-2 lg:col-span-7 xl:col-span-7 relative w-full h-[260px] xs:h-[320px] sm:h-[420px] lg:h-auto min-h-full overflow-hidden bg-[#ded8cd]">
          <img
            src={playfulGlowTrioImg}
            alt="Mile Infinity Botanical Skincare Ritual"
            className="w-full h-full object-cover object-[75%_center] lg:object-center select-none"
          />
        </div>

        {/* Story Copy: Sits BELOW photo on mobile view (order-2), left side on desktop (order-1) */}
        <div className="order-2 lg:order-1 lg:col-span-5 xl:col-span-5 flex flex-col justify-center px-4 xs:px-6 sm:px-12 lg:pl-16 xl:pl-24 2xl:pl-32 lg:pr-8 py-6 xs:py-8 sm:py-14 lg:py-24 z-10 bg-[#faf8f4] lg:bg-transparent">
          <div className="inline-flex items-center gap-2.5 xs:gap-3 mb-2.5 xs:mb-3.5 sm:mb-6">
            <span className="h-[1px] w-5 xs:w-6 bg-[#162e21]/40" />
            <span className="text-[10px] xs:text-[11px] font-semibold tracking-[0.24em] uppercase text-[#162e21]/80 font-sans">
              Our Story
            </span>
          </div>

          <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[62px] 2xl:text-[70px] font-normal leading-[1.08] text-[#162e21] tracking-tight">
            Skincare,<br />
            Rooted in Nature.<br />
            Designed for<br />
            Modern Rituals.
          </h1>

          <p className="mt-3 xs:mt-4 sm:mt-8 text-xs xs:text-sm sm:text-base leading-relaxed text-[#2c3d33]/85 max-w-lg font-sans">
            Discover Mile Infinity's thoughtful approach to everyday skincare,
            inspired by botanical ingredients and designed to bring a more
            intentional feel to your daily rituals.
          </p>

          <div className="mt-5 xs:mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 xs:gap-3 sm:gap-6 max-w-xs sm:max-w-none">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 rounded-none bg-[#162e21] hover:bg-[#0e2017] px-6 xs:px-8 py-3 xs:py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:shadow-lg group text-center"
            >
              <span>Explore the Collection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#philosophy"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:text-[#0e2017] transition-all group py-2"
            >
              <span>Our Philosophy</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 2. Sub-bar Ribbon:
 * - Left: "A little more intention. Every day."
 * - Right: "OUR PHILOSOPHY / OUR INSPIRATION / YOUR RITUAL"
 */
function AboutSubBar() {
  return (
    <nav
      aria-label="Story sub-navigation"
      className="border-b border-[#e5dfd5] bg-[#faf8f5] py-3.5 sm:py-5 w-full overflow-x-auto no-scrollbar"
    >
      <div className="w-full px-4 xs:px-6 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left">
        <p className="font-display italic text-base sm:text-xl text-[#162e21]/90">
          A little more intention. Every day.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-5 text-[10px] xs:text-[11px] font-semibold tracking-[0.16em] xs:tracking-[0.18em] uppercase text-[#162e21]/70 font-sans">
          <a
            href="#philosophy"
            className="hover:text-[#162e21] transition-colors"
          >
            Our Philosophy
          </a>
          <span className="text-[#162e21]/30">/</span>
          <a
            href="#inspiration"
            className="hover:text-[#162e21] transition-colors"
          >
            Our Inspiration
          </a>
          <span className="text-[#162e21]/30">/</span>
          <a
            href="#ritual"
            className="hover:text-[#162e21] transition-colors"
          >
            Your Ritual
          </a>
        </div>
      </div>
    </nav>
  );
}

/**
 * 3. Our Philosophy Section:
 * - Headline: "Beauty Begins with Thoughtful Care."
 * - Left: Golden Serum dish macro photography
 * - Right: "Not another demand. A moment for you." + Body copy + Link
 */
function AboutPhilosophySection() {
  return (
    <section id="philosophy" className="scroll-mt-24 bg-white py-12 xs:py-16 lg:py-24 xl:py-28 border-b border-[#e5dfd5] w-full">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="text-center max-w-2xl mx-auto mb-8 xs:mb-12 lg:mb-16">
          <p className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans mb-2 xs:mb-3">
            Our Philosophy
          </p>
          <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-normal text-[#162e21] leading-tight">
            Beauty Begins with Thoughtful Care.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left Column: Golden serum macro photography */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-[#e5dfd5]/80 bg-[#f7f5ef] group shadow-sm">
              <img
                src={goldenSerumImg}
                alt="Mile Infinity golden serum thoughtful formulation"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h3 className="font-display text-xl xs:text-2xl sm:text-3xl xl:text-4xl text-[#162e21] font-normal leading-snug">
              Not another demand.<br className="hidden sm:block" />
              A moment for you.
            </h3>

            <div className="mt-4 xs:mt-6 space-y-3 xs:space-y-4 text-xs sm:text-base leading-relaxed text-[#2c3d33]/85 font-sans">
              <p>
                Mile Infinity skincare begins with a simple perspective: everyday care
                can feel considered, not complicated. Botanical inspiration gives our
                collection its character; the way it fits into your life gives it meaning.
              </p>
              <p>
                Our approach to thoughtful formulation connects each product to a
                clear place in your routine. From the first cleanse to the final daytime
                step, we invite you to make room for a ritual that feels your own.
              </p>
            </div>

            <div className="mt-6 xs:mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 xs:gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:text-[#0e2017] transition-all group font-sans"
              >
                <span>Find Your Everyday Essentials</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. Our Botanical Inspiration Section (Dark Forest Green Background):
 * - Headline: "Nature, Thoughtfully Considered."
 * - Right: Intro summary paragraph
 * - Center: Botanical editorial triptych (Beetroot / Green tea / Blueberry & lavender)
 * - Footer: "Inspired by nature. Understood through detail." + Formulation note
 */
function AboutBotanicalInspirationSection() {
  return (
    <section id="inspiration" className="scroll-mt-24 bg-[#0e261c] text-[#f7f5f0] py-12 xs:py-16 lg:py-24 xl:py-28 border-b border-[#163729] w-full">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 xs:gap-6 pb-8 xs:pb-12 border-b border-[#f7f5f0]/15">
          <div>
            <p className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a3c9b4] font-sans mb-2 xs:mb-3">
              Our Botanical Inspiration
            </p>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-normal text-white leading-tight">
              Nature,<br className="hidden sm:block" />
              Thoughtfully Considered.
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-[#f7f5f0]/75 leading-relaxed font-sans">
            From the rich colour of beetroot to green tea, blueberry and lavender,
            nature shapes the language of our botanical-inspired skincare. A point
            of inspiration, thoughtfully carried into everyday care.
          </p>
        </div>

        {/* Botanical Editorial Triptych Banner */}
        <div className="mt-8 xs:mt-12 overflow-hidden rounded-xs border border-[#f7f5f0]/15 bg-black/20 shadow-xl group">
          <img
            src={botanicalTriptychImg}
            alt="Botanical editorial triptych: Beetroot (The Cleanse), Green tea (The Serum), Blueberry & lavender (The Moisturiser)"
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
        </div>

        {/* Bottom caption notes */}
        <div className="mt-6 xs:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 text-xs font-sans text-[#f7f5f0]/70 pt-4 border-t border-[#f7f5f0]/10">
          <p className="font-display italic text-sm xs:text-base sm:text-lg text-white/90">
            Inspired by nature. Understood through detail.
          </p>
          <p className="max-w-md text-[10px] xs:text-[11px] text-[#f7f5f0]/60 leading-normal">
            These are our botanical references, not a full ingredient list. For formulation details, read the product information and packaging.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * 5. The Mile Infinity Approach:
 * - Left: "Less Noise. More Thoughtful Care." + quote
 * - Right: 4 numbered principles (01 Plant-Based Inspiration, 02 Conscious Care, 03 Thoughtful Formulation, 04 Cruelty-Free Commitment)
 */
function AboutApproachSection() {
  const principles = [
    {
      num: "01",
      title: "Plant-Based Inspiration",
      text: "Botanical references give our collection its distinct character, without asking nature to promise more than it can.",
    },
    {
      num: "02",
      title: "Conscious Care",
      text: "A considered choice starts with understanding what you use and where it belongs in your everyday skincare routine.",
    },
    {
      num: "03",
      title: "Thoughtful Formulation",
      text: "A clear role for every product. Explore each formulation's information and directions before making it part of your ritual.",
    },
    {
      num: "04",
      title: "Cruelty-Free Commitment",
      text: "Mile Infinity products are not tested on animals. A straightforward commitment that is part of our approach to care.",
    },
  ];

  return (
    <section className="bg-white py-12 xs:py-16 lg:py-24 xl:py-28 border-b border-[#e5dfd5] w-full">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-12 lg:gap-16 xl:gap-24 items-start">
          {/* Left Column: Heading & Quote */}
          <div className="lg:col-span-5">
            <p className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans mb-2 xs:mb-3">
              The Mile Infinity Approach
            </p>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-normal leading-[1.12] text-[#162e21]">
              Less Noise.<br />
              More Thoughtful<br />
              Care.
            </h2>
            <div className="my-4 xs:my-6 h-[2px] w-12 bg-[#162e21]" />

            <p className="text-xs xs:text-sm sm:text-base leading-relaxed text-[#2c3d33]/85 font-sans">
              Four principles guide how we think about skincare products, and the place they hold in your life.
            </p>

            <p className="mt-6 xs:mt-8 font-display italic text-lg xs:text-xl sm:text-2xl xl:text-3xl text-[#162e21]/90">
              Considered choices.<br />
              Personal rituals.
            </p>
          </div>

          {/* Right Column: 4 Numbered Principles */}
          <div className="lg:col-span-7 divide-y divide-[#e5dfd5] border-y border-[#e5dfd5]">
            {principles.map((p) => (
              <div key={p.num} className="py-5 xs:py-7 sm:py-9 flex items-start gap-4 xs:gap-6 sm:gap-10 group">
                <span className="font-display text-xl xs:text-2xl sm:text-3xl xl:text-4xl text-[#162e21]/40 group-hover:text-[#162e21] transition-colors shrink-0">
                  {p.num}
                </span>
                <div>
                  <h3 className="font-display text-lg xs:text-xl sm:text-2xl xl:text-[26px] text-[#162e21] font-normal">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 xs:mt-2 text-xs sm:text-sm text-[#2c3d33]/80 leading-relaxed font-sans">
                    {p.text}
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
 * 6. A Moment, Made Everyday: Make Time for Your Skin (Dark Forest Green Background)
 * - Headline: "Make Time for Your Skin."
 * - 4-step ritual cards with forward arrows (01 Cleanse -> 02 Treat -> 03 Moisturise -> 04 Protect)
 * - Bottom note & Link to Skincare Journal
 */
function AboutRitualSequenceSection() {
  const steps = [
    {
      num: "01",
      step: "Cleanse",
      product: "Crimson Beauty Beetroot Facewash",
      desc: "Begin with your cleansing step. Follow the facewash directions, then rinse as instructed.",
      tag: null,
    },
    {
      num: "02",
      step: "Treat",
      product: "Ceremonial Green Fusion Serum",
      desc: "Make space for your serum after cleansing. Let the product directions guide its use.",
      tag: null,
    },
    {
      num: "03",
      step: "Moisturise",
      product: "Blue Berry & Lavender Bliss Moisturiser",
      desc: "Follow with moisturiser, using the guidance on the packaging for your product.",
      tag: null,
    },
    {
      num: "04",
      step: "Protect",
      product: "Sunnykiss Radiance SPF 50 Sunscreen",
      desc: "Finish your daytime routine with sunscreen. Follow the label for application and reapplication.",
      tag: "DAYTIME",
    },
  ];

  return (
    <section id="ritual" className="scroll-mt-24 bg-[#0e261c] text-[#f7f5f0] py-12 xs:py-16 lg:py-24 xl:py-28 border-b border-[#163729] w-full">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 xs:gap-6 pb-8 xs:pb-12 border-b border-[#f7f5f0]/15">
          <div>
            <p className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a3c9b4] font-sans mb-2 xs:mb-3">
              A Moment, Made Everyday
            </p>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-normal text-white leading-tight">
              Make Time for Your Skin.
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-[#f7f5f0]/75 leading-relaxed font-sans">
            An everyday skincare routine doesn't need to feel like another task. Give each step a little space.
          </p>
        </div>

        {/* 4-Step Cards */}
        <div className="mt-8 xs:mt-12 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 lg:gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="relative rounded-xs border border-[#f7f5f0]/15 bg-white/[0.04] p-4 xs:p-6 lg:p-7 xl:p-8 flex flex-col justify-between backdrop-blur-xs transition-all duration-300 hover:bg-white/[0.08] hover:border-[#f7f5f0]/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-sans text-[#a3c9b4]">
                  <span className="font-display text-2xl xs:text-3xl sm:text-4xl text-white/90">
                    {s.num}
                  </span>
                  {s.tag && (
                    <span className="text-[9px] xs:text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-xs text-[#a3c9b4] font-semibold">
                      {s.tag}
                    </span>
                  )}
                  {idx < steps.length - 1 && !s.tag && (
                    <ArrowRight className="h-4 w-4 text-[#a3c9b4]/60 hidden lg:block" />
                  )}
                </div>

                <h3 className="mt-3 xs:mt-4 font-display text-xl xs:text-2xl text-white font-normal">
                  {s.step}
                </h3>
                <p className="mt-1 text-[11px] xs:text-xs font-medium text-[#a3c9b4] font-sans">
                  {s.product}
                </p>

                <p className="mt-3 xs:mt-4 text-[11px] xs:text-xs text-[#f7f5f0]/75 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 xs:mt-12 pt-5 xs:pt-6 border-t border-[#f7f5f0]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 text-xs font-sans text-[#f7f5f0]/70">
          <p className="max-w-xl text-[10px] xs:text-[11px] leading-relaxed">
            Your packaging is the guide. Always follow each product's directions and precautions; this sequence is a starting point for organising your ritual.
          </p>
          <a
            href="/#ritual"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:text-[#a3c9b4] transition-colors shrink-0"
          >
            <span>Read the Skincare Journal</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * 7. The Everyday Collection: Discover Your Everyday Ritual (Staggered Product Cards)
 * - Header: "Discover Your Everyday Ritual." + "Four essentials. Four distinct moments of care."
 * - 4 Staggered Product Cards using the high-resolution cropped artwork
 */
function AboutEverydayCollectionSection() {
  const collection = [
    {
      step: "01 / CLEANSE",
      title: "Mile Infinity Crimson Beauty Beetroot Facewash",
      desc: "A beetroot-inspired beginning. Make cleansing the opening moment of your ritual.",
      cta: "Discover the Facewash",
      href: "/product",
      img: staggeredFacewashImg,
      stagger: false,
    },
    {
      step: "02 / TREAT",
      title: "Mile Infinity Ceremonial Green Fusion Serum",
      desc: "Green tea inspiration, with a dedicated place between cleansing and moisturising.",
      cta: "Discover the Serum",
      href: "/shop",
      img: staggeredSerumImg,
      stagger: true,
    },
    {
      step: "03 / MOISTURISE",
      title: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
      desc: "Blueberry and lavender inspiration for a considered moisturising moment.",
      cta: "Discover the Moisturiser",
      href: "/shop",
      img: staggeredMoisturiserImg,
      stagger: false,
    },
    {
      step: "04 / PROTECT",
      title: "Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen",
      desc: "The final daytime step. A place for SPF 50 in your everyday skincare routine.",
      cta: "Discover the Sunscreen",
      href: "/shop",
      img: staggeredSunscreenImg,
      stagger: true,
    },
  ];

  return (
    <section id="collection" className="scroll-mt-24 bg-[#faf8f5] py-12 xs:py-16 lg:py-24 xl:py-28 border-b border-[#e5dfd5] w-full">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 xs:gap-6 mb-8 xs:mb-14">
          <div>
            <p className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans mb-2 xs:mb-3">
              The Everyday Collection
            </p>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-normal text-[#162e21] leading-tight">
              Discover Your Everyday Ritual.
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2.5 xs:gap-3">
            <p className="max-w-md text-xs sm:text-sm text-[#2c3d33]/80 leading-relaxed font-sans lg:text-right">
              Four essentials. Four distinct moments of care. Get to know the collection, then make it your own.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#162e21] hover:text-[#0e2017] transition-all group font-sans"
            >
              <span>Explore All Skincare</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 4 Staggered Products Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 xs:gap-6 lg:gap-6 xl:gap-8 items-start">
          {collection.map((item) => (
            <div
              key={item.step}
              className={`flex flex-col justify-between transition-transform duration-500 group ${
                item.stagger ? "lg:translate-y-12" : ""
              }`}
            >
              {/* Product Visual Container */}
              <Link
                to={item.href}
                className="relative aspect-[3/4] overflow-hidden rounded-xs border border-[#e5dfd5] bg-[#f7f5ef] shadow-xs group-hover:shadow-md transition-shadow"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Product Info */}
              <div className="mt-4 xs:mt-5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[9px] xs:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e6833] font-sans">
                    {item.step}
                  </span>
                  <h3 className="mt-1.5 xs:mt-2 font-display text-lg xs:text-xl sm:text-2xl text-[#162e21] font-normal leading-snug group-hover:text-[#0e2017] transition-colors">
                    <Link to={item.href}>{item.title}</Link>
                  </h3>
                  <p className="mt-2 xs:mt-2.5 text-xs text-[#2c3d33]/80 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3.5 xs:mt-4 pt-2.5 xs:pt-3 border-t border-[#e5dfd5]/80">
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-2 text-[10px] xs:text-[11px] font-semibold uppercase tracking-[0.16em] text-[#162e21] group-hover:text-[#8e6833] transition-colors font-sans"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 8. Closing Luxury Banner: Your skin. Your ritual. Your Mile Infinity.
 * - 100% Full-Width Screen Background
 * - Headline & CTAs
 */
function AboutClosingBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0c2219]">
      <div className="relative min-h-[440px] xs:min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] w-full flex items-center justify-center">
        {/* Background Visual matching Frame 30 spanning full screen width */}
        <img
          src={closingBannerImg}
          alt="Your skin. Your ritual. Your Mile Infinity."
          className="absolute inset-0 h-full w-full object-cover object-center select-none"
        />

        {/* Gradient Overlay for contrast and elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2219]/90 via-[#0c2219]/50 to-[#0c2219]/80 sm:bg-black/25 pointer-events-none" />

        {/* Banner Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 xs:px-6 text-center py-12 xs:py-16 sm:py-20">
          <h2 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-normal leading-[1.12] text-white tracking-tight drop-shadow-md">
            Your skin.<br />
            Your ritual.<br />
            Your Mile Infinity.
          </h2>

          <p className="mt-3 xs:mt-5 sm:mt-6 text-xs xs:text-sm sm:text-base text-white/90 max-w-lg mx-auto font-sans leading-relaxed drop-shadow-sm">
            Discover skincare designed to make everyday care feel more intentional.
          </p>

          <div className="mt-6 xs:mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 xs:gap-3 sm:gap-6 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 rounded-none bg-[#f7f5f0] hover:bg-white text-[#162e21] px-6 xs:px-8 py-3 xs:py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.16em] shadow-lg transition-all duration-300 hover:scale-[1.02] group text-center"
            >
              <span>Shop All Skincare</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 rounded-none border border-white/60 bg-transparent hover:bg-white/10 text-white px-6 xs:px-8 py-3 xs:py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:scale-[1.02] group text-center"
            >
              <span>Explore the Brand</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
