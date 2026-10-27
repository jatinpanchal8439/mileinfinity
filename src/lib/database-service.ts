import { supabase } from "@/integrations/supabase/client";
import type { ProductDto } from "@/lib/store.functions";
import { sanitizeInput, type ProductFormValues } from "@/lib/security";

// Initial Botanical Skincare Products Seed
export const DEFAULT_SQL_PRODUCTS: ProductDto[] = [
  {
    id: "prod-1",
    name: "Mile Infinity Crimson Beauty Beetroot Facewash",
    slug: "crimson-beauty-beetroot-facewash",
    tagline: "With AHA, BHA & Mulberry for gentle daily cleansing",
    description: "Formulated with pure beetroot extract, AHAs and mulberries to purify and revitalize.",
    category: "cleanse",
    priceInr: 999,
    comparePriceInr: 1199,
    imageUrl: "/images/card-beetroot.png",
    sizes: ["100ml"],
    isNew: true,
    stock: 45,
  },
  {
    id: "prod-2",
    name: "Mile Infinity Ceremonial Green Fusion Serum",
    slug: "ceremonial-green-fusion-serum",
    tagline: "With White Tea, Green Tea & Avocado for barrier repair",
    description: "An antioxidant-rich ceremonial green serum that soothes redness and restores natural moisture.",
    category: "serum",
    priceInr: 1599,
    comparePriceInr: 1899,
    imageUrl: "/images/card-green.png",
    sizes: ["30ml"],
    isNew: true,
    stock: 32,
  },
  {
    id: "prod-3",
    name: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
    slug: "blueberry-lavender-bliss-moisturiser",
    tagline: "With Blue Berry Extract & Soothing French Lavender",
    description: "A decadent, non-greasy day & night hydration veil enriched with whipped botanicals.",
    category: "moisturizer",
    priceInr: 1099,
    comparePriceInr: 1399,
    imageUrl: "/images/product-blueberry.png",
    sizes: ["50ml"],
    isNew: false,
    stock: 18,
  },
  {
    id: "prod-4",
    name: "Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen",
    slug: "sunnykiss-radiance-spf-sunscreen",
    tagline: "Ultra-Light Invisible Broad Spectrum Mineral Shield",
    description: "Non-comedogenic physical filter with zero white cast, infused with botanical antioxidants.",
    category: "sunscreen",
    priceInr: 1299,
    comparePriceInr: 1599,
    imageUrl: "/images/product-sunscreen.png",
    sizes: ["100ml"],
    isNew: true,
    stock: 24,
  },
];

const PRODUCTS_STORAGE_KEY = "mile-infinity-sql-products";

/**
 * Complete SQL Schema DDL (PostgreSQL / Supabase compatible)
 */
export const POSTGRES_SQL_SCHEMA = `-- ==============================================================
-- MILE INFINITY COMMERCE — COMPLETE POSTGRESQL DATABASE SCHEMA
-- Generated for PostgreSQL 14+ / Supabase Cloud / Drizzle ORM
-- ==============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PRODUCTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'serum',
  price_inr INTEGER NOT NULL CHECK (price_inr > 0),
  compare_price_inr INTEGER CHECK (compare_price_inr IS NULL OR compare_price_inr > 0),
  image_url TEXT,
  sizes TEXT[] NOT NULL DEFAULT '{30ml,50ml}',
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  stock INTEGER NOT NULL DEFAULT 50 CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-speed catalog lookup
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- 3. CUSTOMER ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  address_line TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  subtotal_inr INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' 
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_gateway TEXT NOT NULL DEFAULT 'Razorpay',
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'failed')),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  shiprocket_order_id TEXT,
  awb_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 4. ORDER LINE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_inr INTEGER NOT NULL
);

-- 5. ADMIN USER ROLES & PERMISSIONS (RBAC)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'editor');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 6. SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Public can view active products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- Orders insertion allowed for checkout
DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
CREATE POLICY "Anyone can place orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- 7. INITIAL PRODUCT SEED DATA INSERTION
INSERT INTO public.products (name, slug, tagline, description, category, price_inr, compare_price_inr, image_url, sizes, is_new, stock)
VALUES 
  ('Mile Infinity Crimson Beauty Beetroot Facewash', 'crimson-beauty-beetroot-facewash', 'With AHA, BHA & Mulberry for gentle daily cleansing', 'Formulated with pure beetroot extract, AHAs and mulberries to purify and revitalize.', 'cleanse', 999, 1199, '/images/card-beetroot.png', '{100ml}', true, 45),
  ('Mile Infinity Ceremonial Green Fusion Serum', 'ceremonial-green-fusion-serum', 'With White Tea, Green Tea & Avocado for barrier repair', 'An antioxidant-rich ceremonial green serum that soothes redness and restores natural moisture.', 'serum', 1599, 1899, '/images/card-green.png', '{30ml}', true, 32),
  ('Mile Infinity Blue Berry & Lavender Bliss Moisturiser', 'blueberry-lavender-bliss-moisturiser', 'With Blue Berry Extract & Soothing French Lavender', 'A decadent, non-greasy day & night hydration veil enriched with whipped botanicals.', 'moisturizer', 1099, 1399, '/images/product-blueberry.png', '{50ml}', false, 18),
  ('Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen', 'sunnykiss-radiance-spf-sunscreen', 'Ultra-Light Invisible Broad Spectrum Mineral Shield', 'Non-comedogenic physical filter with zero white cast, infused with botanical antioxidants.', 'sunscreen', 1299, 1599, '/images/product-sunscreen.png', '{100ml}', true, 24)
ON CONFLICT (slug) DO NOTHING;
`;

/**
 * Fetch products from database with fallback to synchronized local SQL storage
 */
export async function getDatabaseProducts(): Promise<ProductDto[]> {
  if (typeof window === "undefined") return DEFAULT_SQL_PRODUCTS;

  try {
    // Attempt remote Supabase query first if online
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: ProductDto[] = data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        category: p.category,
        priceInr: p.price_inr,
        comparePriceInr: p.compare_price_inr,
        imageUrl: p.image_url,
        sizes: p.sizes || ["30ml"],
        isNew: p.is_new,
        stock: p.stock,
      }));
      // Cache locally
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (err) {
    console.warn("Supabase query fallback to local SQL store:", err);
  }

  // Fallback to local SQL store
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_SQL_PRODUCTS));
      return DEFAULT_SQL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SQL_PRODUCTS;
  }
}

/**
 * Add product to SQL database dynamically
 */
export async function addDatabaseProduct(input: ProductFormValues): Promise<ProductDto> {
  const sanitizedName = sanitizeInput(input.name);
  const sanitizedTagline = input.tagline ? sanitizeInput(input.tagline) : "";
  const sanitizedDesc = input.description ? sanitizeInput(input.description) : "";

  const newId = "prod-" + Date.now();
  const createdProduct: ProductDto = {
    id: newId,
    name: sanitizedName,
    slug: input.slug,
    tagline: sanitizedTagline,
    description: sanitizedDesc,
    category: input.category,
    priceInr: input.priceInr,
    comparePriceInr: input.comparePriceInr || null,
    imageUrl: input.imageUrl,
    sizes: input.sizes,
    isNew: input.isNew,
    stock: input.stock,
  };

  // 1. Persist to Supabase if connected
  try {
    await supabase.from("products").insert({
      id: newId,
      name: sanitizedName,
      slug: input.slug,
      tagline: sanitizedTagline,
      description: sanitizedDesc,
      category: input.category,
      price_inr: input.priceInr,
      compare_price_inr: input.comparePriceInr || null,
      image_url: input.imageUrl,
      sizes: input.sizes,
      is_new: input.isNew,
      is_active: input.isActive,
      stock: input.stock,
    });
  } catch (e) {
    console.warn("Supabase insert logged, syncing to local SQL state", e);
  }

  // 2. Persist to local synchronized SQL storage
  if (typeof window !== "undefined") {
    try {
      const current = await getDatabaseProducts();
      const updated = [createdProduct, ...current];
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("mile-infinity-products-updated", { detail: updated }));
    } catch (e) {
      console.error("Local storage error", e);
    }
  }

  return createdProduct;
}

/**
 * Update an existing product in SQL database
 */
export async function updateDatabaseProduct(
  id: string,
  updates: Partial<ProductFormValues>
): Promise<ProductDto | null> {
  if (typeof window === "undefined") return null;

  try {
    const current = await getDatabaseProducts();
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = current[index]!;
    const updated: ProductDto = {
      ...existing,
      name: updates.name ? sanitizeInput(updates.name) : existing.name,
      slug: updates.slug || existing.slug,
      tagline: updates.tagline !== undefined ? sanitizeInput(updates.tagline) : existing.tagline,
      description: updates.description !== undefined ? sanitizeInput(updates.description) : existing.description,
      category: updates.category || existing.category,
      priceInr: updates.priceInr !== undefined ? updates.priceInr : existing.priceInr,
      comparePriceInr: updates.comparePriceInr !== undefined ? updates.comparePriceInr : existing.comparePriceInr,
      imageUrl: updates.imageUrl || existing.imageUrl,
      sizes: updates.sizes || existing.sizes,
      stock: updates.stock !== undefined ? updates.stock : existing.stock,
      isNew: updates.isNew !== undefined ? updates.isNew : existing.isNew,
    };

    current[index] = updated;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(current));

    // Try remote update
    try {
      await supabase
        .from("products")
        .update({
          name: updated.name,
          slug: updated.slug,
          tagline: updated.tagline,
          description: updated.description,
          category: updated.category,
          price_inr: updated.priceInr,
          compare_price_inr: updated.comparePriceInr,
          image_url: updated.imageUrl,
          sizes: updated.sizes,
          stock: updated.stock,
          is_new: updated.isNew,
        })
        .eq("id", id);
    } catch {}

    window.dispatchEvent(new CustomEvent("mile-infinity-products-updated", { detail: current }));
    return updated;
  } catch (e) {
    console.error("Failed to update product", e);
    return null;
  }
}

/**
 * Delete a product from SQL database
 */
export async function deleteDatabaseProduct(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const current = await getDatabaseProducts();
    const filtered = current.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));

    try {
      await supabase.from("products").delete().eq("id", id);
    } catch {}

    window.dispatchEvent(new CustomEvent("mile-infinity-products-updated", { detail: filtered }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Reset and re-seed default SQL botanical inventory
 */
export function resetDatabaseToDefault(): ProductDto[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_SQL_PRODUCTS));
    window.dispatchEvent(new CustomEvent("mile-infinity-products-updated", { detail: DEFAULT_SQL_PRODUCTS }));
  }
  return DEFAULT_SQL_PRODUCTS;
}
