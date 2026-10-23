import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function makePublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string;
  priceInr: number;
  comparePriceInr: number | null;
  imageUrl: string | null;
  sizes: string[];
  isNew: boolean;
  stock: number;
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = makePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, tagline, description, category, price_inr, compare_price_inr, image_url, sizes, is_new, stock")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error("Could not load products");
  return (data ?? []).map(
    (p): ProductDto => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      priceInr: p.price_inr,
      comparePriceInr: p.compare_price_inr,
      imageUrl: p.image_url,
      sizes: p.sizes ?? [],
      isNew: p.is_new,
      stock: p.stock,
    }),
  );
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const supabase = makePublicClient();
    const { data: p, error } = await supabase
      .from("products")
      .select("id, name, slug, tagline, description, category, price_inr, compare_price_inr, image_url, sizes, is_new, stock")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !p) return null;
    const product: ProductDto = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      priceInr: p.price_inr,
      comparePriceInr: p.compare_price_inr,
      imageUrl: p.image_url,
      sizes: p.sizes ?? [],
      isNew: p.is_new,
      stock: p.stock,
    };
    return product;
  });

export interface CheckoutInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    pincode: string;
  };
  items: { productId: string; size: string; quantity: number }[];
}

function makeOrderNumber(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `MI-${stamp}${rand}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: CheckoutInput) => input)
  .handler(async ({ data }) => {
    const supabase = makePublicClient();
    const ids = [...new Set(data.items.map((i) => i.productId))];
    if (ids.length === 0) throw new Error("Your bag is empty");
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id, name, price_inr, is_active, stock")
      .in("id", ids);
    if (pErr || !products) throw new Error("Could not verify products");
    const byId = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const lines = data.items.map((item) => {
      const p = byId.get(item.productId);
      if (!p || !p.is_active) throw new Error("A product in your bag is no longer available");
      const lineTotal = p.price_inr * item.quantity;
      subtotal += lineTotal;
      return {
        product_id: p.id,
        product_name: p.name,
        size: item.size,
        quantity: item.quantity,
        unit_price_inr: p.price_inr,
      };
    });

    const orderNumber = makeOrderNumber();
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customer.name,
        customer_email: data.customer.email,
        customer_phone: data.customer.phone,
        address_line: data.customer.addressLine,
        city: data.customer.city,
        pincode: data.customer.pincode,
        subtotal_inr: subtotal,
      })
      .select("id")
      .single();
    if (oErr || !order) throw new Error("Could not place the order");

    const { error: iErr } = await supabase
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));
    if (iErr) throw new Error("Could not save the order items");

    return { orderNumber };
  });

export interface OrderView {
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  subtotalInr: number;
  createdAt: string;
  items: { productName: string; size: string | null; quantity: number; unitPriceInr: number }[];
}

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((input: { orderNumber: string }) => input)
  .handler(async ({ data }) => {
    // Privileged read: orders hold customer PII and anon SELECT is not granted.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, customer_name, customer_email, subtotal_inr, created_at")
      .eq("order_number", data.orderNumber)
      .maybeSingle();
    if (!order) return null;
    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_name, size, quantity, unit_price_inr")
      .eq("order_id", order.id);
    const view: OrderView = {
      orderNumber: order.order_number,
      status: order.status,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      subtotalInr: order.subtotal_inr,
      createdAt: order.created_at,
      items: (items ?? []).map((i) => ({
        productName: i.product_name,
        size: i.size,
        quantity: i.quantity,
        unitPriceInr: i.unit_price_inr,
      })),
    };
    return view;
  });

async function requireAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin" as never,
  });
  if (!isAdmin) throw new Error("Forbidden: admin access required");
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  addressLine: string;
  city: string | null;
  pincode: string | null;
  subtotalInr: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export const adminGetStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count: orderCount } = await supabaseAdmin.from("orders").select("*", { count: "exact", head: true });
    const { count: pendingCount } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    const { count: productCount } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });
    const { data: revenueRows } = await supabaseAdmin
      .from("orders")
      .select("subtotal_inr")
      .neq("status", "cancelled");
    const revenue = (revenueRows ?? []).reduce((sum, r) => sum + r.subtotal_inr, 0);
    const { data: recent } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    return {
      orderCount: orderCount ?? 0,
      pendingCount: pendingCount ?? 0,
      productCount: productCount ?? 0,
      revenueInr: revenue,
      recentOrders: (recent ?? []).map(
        (o): AdminOrderRow => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          addressLine: o.address_line,
          city: o.city,
          pincode: o.pincode,
          subtotalInr: o.subtotal_inr,
          status: o.status,
          createdAt: o.created_at,
          itemCount: 0,
        }),
      ),
    };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    const rows: AdminOrderRow[] = [];
    for (const o of orders ?? []) {
      const { count } = await supabaseAdmin
        .from("order_items")
        .select("*", { count: "exact", head: true })
        .eq("order_id", o.id);
      rows.push({
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        customerPhone: o.customer_phone,
        addressLine: o.address_line,
        city: o.city,
        pincode: o.pincode,
        subtotalInr: o.subtotal_inr,
        status: o.status,
        createdAt: o.created_at,
        itemCount: count ?? 0,
      });
    }
    return rows;
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Could not update order");
    return { ok: true };
  });

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category: string;
  priceInr: number;
  comparePriceInr: number | null;
  imageUrl: string | null;
  sizes: string[];
  isNew: boolean;
  isActive: boolean;
  stock: number;
}

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    return (data ?? []).map(
      (p): AdminProductRow => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        category: p.category,
        priceInr: p.price_inr,
        comparePriceInr: p.compare_price_inr,
        imageUrl: p.image_url,
        sizes: p.sizes ?? [],
        isNew: p.is_new,
        isActive: p.is_active,
        stock: p.stock,
      }),
    );
  });

export interface ProductInput {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  category: string;
  priceInr: number;
  comparePriceInr?: number | null;
  imageUrl?: string;
  sizes: string[];
  isNew: boolean;
  isActive: boolean;
  stock: number;
}

export const adminCreateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: ProductInput) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").insert({
      name: data.name,
      slug: data.slug,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      category: data.category,
      price_inr: data.priceInr,
      compare_price_inr: data.comparePriceInr ?? null,
      image_url: data.imageUrl ?? null,
      sizes: data.sizes,
      is_new: data.isNew,
      is_active: data.isActive,
      stock: data.stock,
    });
    if (error) throw new Error(error.message.includes("slug") ? "That product URL is already used" : "Could not create product");
    return { ok: true };
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string } & ProductInput) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("products")
      .update({
        name: data.name,
        slug: data.slug,
        tagline: data.tagline ?? null,
        description: data.description ?? null,
        category: data.category,
        price_inr: data.priceInr,
        compare_price_inr: data.comparePriceInr ?? null,
        image_url: data.imageUrl ?? null,
        sizes: data.sizes,
        is_new: data.isNew,
        is_active: data.isActive,
        stock: data.stock,
      })
      .eq("id", data.id);
    if (error) throw new Error("Could not update product");
    return { ok: true };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete product");
    return { ok: true };
  });

export const ensureAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin" as never,
    });
    return { isAdmin: !!isAdmin };
  });
