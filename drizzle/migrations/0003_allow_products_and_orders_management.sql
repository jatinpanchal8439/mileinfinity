-- ==============================================================
-- MILE INFINITY — STORE DATABASE MANAGEMENT POLICIES
-- Allows dynamic product creation, updates, and live orders sync
-- ==============================================================

-- 1. PRODUCTS TABLE PERMISSIONS & POLICIES
GRANT ALL ON public.products TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;

CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can insert products"
ON public.products FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update products"
ON public.products FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete products"
ON public.products FOR DELETE
TO anon, authenticated
USING (true);

-- 2. ORDERS & ORDER ITEMS REAL-TIME PERMISSIONS
GRANT ALL ON public.orders TO anon, authenticated;
GRANT ALL ON public.order_items TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Anyone can view orders"
ON public.orders FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Anyone can update orders"
ON public.orders FOR UPDATE
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items"
ON public.order_items FOR SELECT
TO anon, authenticated
USING (true);
