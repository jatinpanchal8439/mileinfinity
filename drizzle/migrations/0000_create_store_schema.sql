create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  category text not null default 'serum',
  price_inr integer not null,
  compare_price_inr integer,
  image_url text,
  sizes text[] not null default '{15ml,30ml}',
  is_new boolean not null default false,
  is_active boolean not null default true,
  stock integer not null default 50,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  address_line text not null,
  city text,
  pincode text,
  subtotal_inr integer not null,
  status text not null default 'pending',
  user_id uuid,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  quantity integer not null default 1,
  unit_price_inr integer not null
);

create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;
GRANT ALL ON public.products TO service_role;
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read order items of own orders" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

INSERT INTO public.products (name, slug, tagline, description, category, price_inr, compare_price_inr, image_url, sizes, is_new) VALUES
('Mile Infinity Crimson Beauty Beetroot Serum', 'crimson-beauty-beetroot-serum', 'Deeply pigment-rich beetroot extract for a naturally flushed, healthy glow', 'A lightweight beetroot-powered serum that restores radiance and supports an even skin tone with daily use.', 'serum', 699, 899, '/images/product-beetroot.png', '{15ml,30ml}', true),
('Mile Infinity Cucumber Green Potion Serum', 'cucumber-green-potion-serum', 'Cooling cucumber and green tea to calm, hydrate and refresh', 'A soothing green serum that calms irritation and floods skin with lightweight hydration.', 'serum', 1199, 1399, '/images/product-cucumber.png', '{15ml,30ml}', true),
('Mile Infinity Blue Berry & Lavender Rice Moisturizer', 'blueberry-lavender-rice-moisturizer', 'Antioxidant blueberry and calming lavender in a whipped rice cream', 'A deeply comforting moisturizer that softens, seals in hydration and leaves skin velvet smooth.', 'moisturizer', 1599, 1799, '/images/product-blueberry.png', '{50ml}', true),
('Mile Infinity Sunaysia Radiance SPF 50+ Sunscreen', 'sunaysia-radiance-spf-sunscreen', 'Broad-spectrum SPF 50+ with a soft-glow, no white-cast finish', 'A daily mineral-hybrid sunscreen that shields from UV while giving skin a natural radiance.', 'sunscreen', 1299, 1499, '/images/product-sunscreen.png', '{50ml}', true);