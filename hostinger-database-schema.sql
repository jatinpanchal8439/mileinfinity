-- ==============================================================================
-- MILE INFINITY DATABASE SCHEMA (HOSTINGER & POSTGRESQL / MYSQL COMPATIBLE)
-- ==============================================================================
-- You can import this file directly into Hostinger phpMyAdmin (MySQL)
-- or Supabase / PostgreSQL SQL Query Editor.
-- ==============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tagline VARCHAR(500),
  description TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'serum',
  price_inr INT NOT NULL,
  compare_price_inr INT,
  image_url VARCHAR(500),
  sizes VARCHAR(255) NOT NULL DEFAULT '30ml,50ml',
  is_new BOOLEAN NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  stock INT NOT NULL DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMER ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(32),
  address_line VARCHAR(500) NOT NULL,
  city VARCHAR(100),
  pincode VARCHAR(20),
  subtotal_inr INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'processing',
  payment_gateway VARCHAR(32) NOT NULL DEFAULT 'Razorpay',
  payment_status VARCHAR(32) NOT NULL DEFAULT 'paid',
  razorpay_payment_id VARCHAR(100),
  razorpay_order_id VARCHAR(100),
  shiprocket_order_id VARCHAR(100),
  awb_code VARCHAR(100),
  courier_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64),
  product_name VARCHAR(255) NOT NULL,
  size VARCHAR(32),
  quantity INT NOT NULL DEFAULT 1,
  unit_price_inr INT NOT NULL
);

-- 4. PROMO COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
  discount_value INT NOT NULL,
  min_order_value_inr INT DEFAULT 0,
  max_discount_inr INT,
  usage_count INT DEFAULT 0,
  usage_limit INT DEFAULT 500,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  expires_at TIMESTAMP
);

-- 5. REGISTERED CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32),
  address_line VARCHAR(500),
  city VARCHAR(100),
  pincode VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- SEED DATA: OFFICIAL MILE INFINITY BOTANICAL PRODUCTS
-- ------------------------------------------------------------------------------
INSERT INTO products (id, name, slug, tagline, description, category, price_inr, compare_price_inr, image_url, sizes, is_new, is_active, stock)
VALUES 
  ('hero-ceremonial-green-fusion', 'Mile Infinity Ceremonial Green Fusion Hero Serum', 'ceremonial-green-fusion-hero-serum', '★ OUR #1 BESTSELLING HERO ESSENTIAL — Ceremonial Matcha & Avocado Barrier Elixir', 'Our signature hero formulation crafted with antioxidant-rich ceremonial green tea, Japanese matcha, cold-pressed avocado, and vitamins C & E to revitalize, hydrate, and impart an ethereal botanical glow.', 'serum', 1699, 2199, '/images/card-green.png', '30ml,50ml', 1, 1, 65),
  ('3f147579-1e72-4338-855a-b9d816a40f7c', 'Mile Infinity Crimson Beauty Beetroot Serum', 'crimson-beauty-beetroot-serum', 'Deeply pigment-rich beetroot extract for a naturally flushed, healthy glow', 'A lightweight beetroot-powered serum that restores radiance and supports an even skin tone with daily use.', 'serum', 699, 899, '/images/product-beetroot.png', '15ml,30ml', 1, 1, 50),
  ('373af9fe-fca4-461e-8413-e4ee8692933b', 'Mile Infinity Cucumber Green Potion Serum', 'cucumber-green-potion-serum', 'Cooling cucumber and green tea to calm, hydrate and refresh', 'A soothing green serum that calms irritation and floods skin with lightweight hydration.', 'serum', 1199, 1399, '/images/product-cucumber.png', '15ml,30ml', 1, 1, 50),
  ('0cb529ce-57e9-41aa-8b52-1ca1bb6256c6', 'Mile Infinity Blue Berry & Lavender Rice Moisturizer', 'blueberry-lavender-rice-moisturizer', 'Antioxidant blueberry and calming lavender in a whipped rice cream', 'A deeply comforting moisturizer that softens, seals in hydration and leaves skin velvet smooth.', 'moisturizer', 1599, 1799, '/images/product-blueberry.png', '50ml', 1, 1, 50),
  ('ca1d19fd-c2d6-4c47-8bdc-0c45d2d7ef6c', 'Mile Infinity Sunaysia Radiance SPF 50+ Sunscreen', 'sunaysia-radiance-spf-sunscreen', 'Broad-spectrum SPF 50+ with a soft-glow, no white-cast finish', 'A daily mineral-hybrid sunscreen that shields from UV while giving skin a natural radiance.', 'sunscreen', 1299, 1499, '/images/product-sunscreen.png', '50ml', 1, 1, 50),
  ('dummy-white-tea-aloe-cleanser', 'Mile Infinity Clarifying White Tea & Aloe Gentle Cleanser', 'clarifying-white-tea-aloe-gentle-cleanser', 'Purifying white tea extract and organic aloe for a balanced, clear complexion', 'A silky, pH-balanced botanical cleanser that dissolves impurities, excess oils, and daily pollution without disrupting the skin moisture barrier.', 'cleanser', 899, 1099, '/images/contact-beetroot-wash.png', '100ml,200ml', 1, 1, 45)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ------------------------------------------------------------------------------
-- SEED DATA: OFFICIAL PROMO COUPON
-- ------------------------------------------------------------------------------
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value_inr, max_discount_inr, usage_limit, is_active)
VALUES 
  ('coup-glow20', 'GLOW20', 'Flat 20% off on all botanical skincare essentials', 'percentage', 20, 999, 500, 1000, 1)
ON DUPLICATE KEY UPDATE discount_value=VALUES(discount_value);
