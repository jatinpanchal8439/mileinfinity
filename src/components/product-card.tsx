import { Link } from "@tanstack/react-router";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import type { ProductDto } from "@/lib/store.functions";

export function ProductCard({ product }: { product: ProductDto }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

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
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="group flex flex-col hover-lift-sm p-2 -m-2 rounded-lg transition-all duration-300 hover:bg-white/60">
      <Link
        to="/product"
        search={{ slug: product.slug }}
        className="relative block overflow-hidden bg-sand rounded-sm"
      >
        {product.isNew && (
          <span className="eyebrow absolute left-3 top-3 z-10 rounded-full bg-background/95 backdrop-blur-sm px-3 py-1 text-primary shadow-sm animate-float-gentle">
            New Product
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
        <span className="eyebrow text-muted-foreground">{product.category}s</span>
        <Link
          to="/product"
          search={{ slug: product.slug }}
          className="mt-1 font-display text-lg leading-snug text-foreground hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.tagline}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-display text-lg text-primary">{formatInr(product.priceInr)}</span>
          {product.comparePriceInr && (
            <span className="text-sm text-muted-foreground line-through">
              {formatInr(product.comparePriceInr)}
            </span>
          )}
          {product.stock <= 0 && (
            <span className="eyebrow ml-auto text-destructive">Sold Out</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className={`btn-primary btn-shimmer mt-4 w-full active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
            added ? "bg-[#1f4e37] text-white" : ""
          }`}
        >
          {added ? (
            <span className="inline-flex items-center gap-1.5 animate-scale-in">
              <Check className="h-4 w-4" /> Added to Bag
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" /> Add to Bag
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
