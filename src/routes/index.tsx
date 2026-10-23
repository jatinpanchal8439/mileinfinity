import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Minus, Plus, Leaf, Heart, Sparkles, ChevronDown } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { productsQueryOptions, productQueryOptions } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import heroModel from "@/assets/hero-model.png";
import ritualPair from "@/assets/ritual-pair.png";
import botanicalCollection from "@/assets/botanical-collection.png";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Index,
  head: () => ({
    meta: [
      { title: "Mile Infinity — Botanical Skincare for Everyday Rituals" },
      {
        name: "description",
        content:
          "Purpose-led botanical skincare. Formulated treatments for hydration, nourishment and sun protection — find your place to begin.",
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
      <Hero />
      <RitualSection products={featured} />
      <BundleBuilder products={featured} />
      <BotanicalSection />
      <ValuesSection />
      <FaqSection />
      <ClosingCta />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[420px] bg-sand lg:min-h-[640px]">
        <img
          src={heroModel}
          alt="Model holding Mile Infinity botanical serum"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex items-center bg-background px-6 py-16 sm:px-12 lg:py-0">
        <div className="max-w-md">
          <p className="eyebrow text-muted-foreground">The daily ritual collection</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-primary sm:text-6xl">
            Botanical skincare, for everyday rituals.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Purpose-led botanical skincare, formulated for treatments, hydration and sun protection.
            Find your place to begin.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link to="/#ritual" className="btn-outline-dark">
              Build a Ritual
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RitualSection({ products }: { products: Awaited<ReturnType<typeof getProductsList>> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-muted-foreground">Shop the formulas</p>
          <h2 className="mt-2 font-display text-4xl text-primary">Your everyday skincare ritual.</h2>
        </div>
        <Link to="/shop" className="btn-outline-dark self-start sm:self-auto">
          All Products
        </Link>
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

async function getProductsList() {
  const { getProducts } = await import("@/lib/store.functions");
  return getProducts();
}

function BundleBuilder({ products }: { products: Awaited<ReturnType<typeof getProductsList>> }) {
  const { add } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const queryClient = useQueryClient();

  const chosen = products.filter((p) => selected.includes(p.id));
  const total = chosen.reduce((sum, p) => sum + p.priceInr, 0);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 2 ? prev : [...prev, id],
    );
    setAdded(false);
  }

  function addBundle() {
    if (chosen.length !== 2) return;
    for (const p of chosen) {
      add({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        size: p.sizes[0] ?? "30ml",
        priceInr: p.priceInr,
        imageUrl: p.imageUrl,
      });
    }
    setAdded(true);
  }

  return (
    <section id="ritual" className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow text-primary-foreground/60">The ritual frame</p>
          <h2 className="mt-3 font-display text-5xl leading-tight">
            Two essentials.
            <br />
            One personal ritual.
          </h2>
          <div className="mt-8 max-w-sm">
            <img
              src={ritualPair}
              alt="Mile Infinity serum and cream on green silk"
              width={600}
              height={600}
              loading="lazy"
              className="w-full rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="rounded-lg bg-background p-6 text-foreground shadow-xl sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-primary">Choose your two.</h3>
            <span className="eyebrow text-muted-foreground">Any 2 products</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Select exactly two products for your personal ritual.</p>
          <div className="mt-5 divide-y divide-border">
            {products.map((p) => {
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className="flex w-full items-center gap-3 py-3 text-left"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </span>
                  <span className="line-clamp-2 flex-1 text-sm">{p.name}</span>
                  <span className="font-display text-lg text-primary">{formatInr(p.priceInr)}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              {chosen.length === 2 ? "Your two essentials" : "Choose 2 products"}
            </span>
            <span className="font-display text-2xl text-primary">{formatInr(total)}</span>
          </div>
          <button
            onClick={addBundle}
            disabled={chosen.length !== 2}
            className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Ritual Added to Bag
              </>
            ) : (
              "Add Ritual to Bag"
            )}
          </button>
          {added && (
            <Link to="/cart" className="mt-3 block text-center text-xs uppercase tracking-[0.16em] text-primary underline">
              View Bag
            </Link>
          )}
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["product"] });
            }}
            className="hidden"
          >
            hidden-refresh
          </button>
        </div>
      </div>
    </section>
  );
}

function BotanicalSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
      <img
        src={botanicalCollection}
        alt="Mile Infinity collection in a botanical garden"
        width={600}
        height={600}
        loading="lazy"
        className="w-full rounded-lg object-cover"
      />
      <div>
        <p className="eyebrow text-muted-foreground">Rooted in nature</p>
        <h2 className="mt-2 font-display text-4xl leading-tight text-primary">
          Botanical inspiration. Thoughtful everyday care.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Mile Infinity is a collection of purpose-led approach to modern skincare. A focused
          selection — created to bring simplicity, clarity and care to your daily routine.
        </p>
        <div className="mt-8 space-y-6">
          {[
            { name: "Beetroot", desc: "For a naturally flushed, healthy-looking glow." },
            { name: "Cucumber", desc: "Brings calm freshness to daily cleansing care." },
            { name: "Blueberry & Lavender", desc: "For comfort, softness and skin that feels settled." },
          ].map((item) => (
            <div key={item.name} className="border-t border-border pt-4">
              <p className="font-display text-xl text-primary">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    { icon: Leaf, title: "Botanical-inspired", desc: "Every formula is inspired by the vitality of the natural world." },
    { icon: Heart, title: "Not tested on animals", desc: "A commitment we hold to in every step of creation." },
    { icon: Sparkles, title: "A considered ritual", desc: "Clear intention, fewer steps — thoughtful skincare." },
  ];
  return (
    <section className="bg-sand py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 className="font-display text-3xl text-primary">Thoughtful care. Everyday beauty.</h2>
          <p className="eyebrow text-muted-foreground">The Mile Infinity approach</p>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4">
              <v.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">{v.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "What is Mile Infinity?",
    a: "Mile Infinity is a purpose-led botanical skincare collection. Every formula is designed to bring intention and simplicity to your everyday routine.",
  },
  {
    q: "What type of skincare products does Mile Infinity offer?",
    a: "We offer serums, moisturizers and sun care — a focused selection of essentials formulated for hydration, nourishment and daily protection.",
  },
  {
    q: "How should I build a basic skincare routine?",
    a: "Begin with a serum, follow with a moisturizer to seal in hydration, and finish with sunscreen in the morning. Two essentials are enough to start.",
  },
  {
    q: "Which Mile Infinity products should I start with?",
    a: "The Crimson Beauty Beetroot Serum and Cucumber Green Potion Serum are gentle, universal first steps for most skin types.",
  },
  {
    q: "How should I use a face serum?",
    a: "Apply a few drops to cleansed skin morning and evening, gently pressing into the face and neck before your moisturizer.",
  },
  {
    q: "When should sunscreen be applied?",
    a: "Every morning as the final step of your routine, and reapply through the day when you are outdoors.",
  },
  {
    q: "Are Mile Infinity products cruelty-free?",
    a: "Yes. We never test on animals, and every formula is created with care for people and the planet.",
  },
  {
    q: "What ingredients are used in Mile Infinity formulations?",
    a: "Botanical extracts such as beetroot, cucumber, blueberry and lavender, paired with skin-identical hydrators and broad-spectrum UV filters.",
  },
];

function FaqSection() {
  return (
    <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="eyebrow text-muted-foreground">Good to know</p>
        <h2 className="mt-2 font-display text-5xl leading-tight text-primary">
          Frequently asked questions.
        </h2>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
          Everything you need to begin a Mile Infinity skincare ritual.
        </p>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground">
              {faq.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-primary py-24 text-center text-primary-foreground">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-display text-5xl italic leading-tight sm:text-6xl">
          Your skin.
          <br />
          Your ritual.
          <br />
          Your Mile Infinity.
        </h2>
        <p className="mt-6 text-sm text-primary-foreground/70">
          Distinct skincare designed to make everyday care feel intuitive and intentional.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-outline-light">
            Shop All Skincare
          </Link>
          <Link to="/#ritual" className="btn-outline-light">
            Explore the Ritual
          </Link>
        </div>
      </div>
    </section>
  );
}
