# Cloudflare Hosting Setup Guide — Mile Infinity Commerce

This project is built with **TanStack Start + Nitro** and already includes native Cloudflare preset support (`cloudflare-module`), generating edge-optimized workers and static assets inside `.output/`.

---

## Option 1: Direct CLI Deployment (Fastest — 60 Seconds)

1. **Log in to Cloudflare with Wrangler**:
   ```bash
   npx wrangler login
   ```
   *(This opens your browser to authorize your free Cloudflare account).*

2. **Deploy to Cloudflare Workers with Static Assets**:
   ```bash
   bun run deploy
   # OR with npm:
   npm run deploy
   ```
   Wrangler will build the project and deploy it immediately. You will receive a live URL like:
   `https://commerce-admin-dashboard.<your-subdomain>.workers.dev`

3. **Set Environment Variables on Cloudflare**:
   ```bash
   npx wrangler secret put RAZORPAY_KEY_ID
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_PUBLISHABLE_KEY
   ```

---

## Option 2: Automatic Git CI/CD via Cloudflare Pages Dashboard

If you prefer Cloudflare to auto-deploy every time you push to GitHub:

1. **Log into Cloudflare Dashboard**:
   Visit [https://dash.cloudflare.com/](https://dash.cloudflare.com/)

2. **Create Pages Project**:
   - Go to **Compute (Workers & Pages)** > **Create** > **Pages** > **Connect to Git**.
   - Select your repository: `jatinpanchal8439/commerce-admin-dashboard`.

3. **Configure Build Settings**:
   - **Framework preset**: `None` / `Custom`
   - **Build command**: `bun run build` *(or `npm run build`)*
   - **Build output directory**: `.output/public`
   - **Root directory**: `/`

4. **Environment Variables**:
   Under **Settings** > **Environment Variables**, add:
   - `NODE_VERSION` = `20`
   - `SUPABASE_URL` = `https://howaceawpfbuthzdajdk.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT`
   - `RAZORPAY_KEY_ID` = `rzp_test_TsreDTx2vLmBw1`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_test_TsreDTx2vLmBw1`

5. **Deploy**:
   Click **Save and Deploy**. Your site will build and be live worldwide in ~90 seconds.

---

## Custom Domain Setup

1. In Cloudflare Dashboard, open your project under **Workers & Pages**.
2. Navigate to **Custom Domains** > **Set up a domain**.
3. Enter your custom domain (e.g. `store.yourdomain.com` or `yourdomain.com`).
4. Cloudflare will automatically provision a free SSL/TLS certificate and enable global DDoS protection.
