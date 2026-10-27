# Railway Hosting Deployment Guide — Mile Infinity Commerce

This full-stack application (TanStack Start + Nitro SSR) is fully configured for deployment on **Railway** via automatic Git sync or Railway CLI.

---

## Step 1: Open Railway & Create New Project
1. Go to [https://railway.com/](https://railway.com/) and sign in with your GitHub account.
2. Click **+ New Project**.
3. Select **Deploy from GitHub repo**.
4. Choose your repository: **`commerce-admin-dashboard`** (or `jatinpanchal8439/commerce-admin-dashboard`).

---

## Step 2: Configure Environment Variables
Inside your Railway project dashboard, click on your service box, open the **Variables** tab, and click **+ Add Variable** (or click **Raw Editor** and paste):

```env
NODE_VERSION=20
NITRO_PRESET=node-server
SUPABASE_URL=https://howaceawpfbuthzdajdk.supabase.co
VITE_SUPABASE_URL=https://howaceawpfbuthzdajdk.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT
RAZORPAY_KEY_ID=rzp_test_TsreDTx2vLmBw1
VITE_RAZORPAY_KEY_ID=rzp_test_TsreDTx2vLmBw1
```

*(Note: Railway automatically provides the `$PORT` environment variable, which Nitro listens on automatically).*

---

## Step 3: Verify Build & Deploy Settings
The repository includes a pre-configured `railway.json` and `Procfile`.
Railway will automatically detect these settings:
- **Build Command**: `NITRO_PRESET=node-server npm run build`
- **Start Command**: `node .output/server/index.mjs`

If you ever need to set them manually in Railway:
- Go to **Settings** > **Build** > **Build Command**: `NITRO_PRESET=node-server npm run build`
- **Deploy** > **Start Command**: `node .output/server/index.mjs`

---

## Step 4: Generate Public Domain
1. In your Railway service dashboard, go to the **Settings** tab.
2. Scroll down to the **Networking** section.
3. Click **Generate Domain** (or **Custom Domain** to link your own domain name like `store.yourdomain.com`).
4. Railway will immediately issue a public HTTPS domain (e.g. `commerce-admin-dashboard-production.up.railway.app`).
5. Click the link to open your live full-stack eCommerce store and admin portal!
