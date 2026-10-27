# Render Hosting Deployment Guide — Mile Infinity Commerce

This full-stack application (TanStack Start + Nitro Node SSR) is 100% ready for deployment on **Render.com** (Free / Starter Tier).

---

## Method 1: Automatic Blueprint (1-Click Deploy via `render.yaml`)

We have added a pre-configured `render.yaml` file in the root of the repository:

1. Log into **[https://render.com/](https://render.com/)** with your GitHub account.
2. Click **+ New** (top right) > **Blueprint**.
3. Connect your GitHub repository: **`jatinpanchal8439/commerce-admin-dashboard`**.
4. Render will automatically read `render.yaml`, pre-filling all build and environment settings.
5. Click **Apply**.
6. Render will automatically build the app and give you a free HTTPS live URL (e.g. `https://commerce-admin-dashboard.onrender.com`).

---

## Method 2: Manual Web Service Setup (Step-by-Step)

If you prefer to configure manually:

1. **Create Web Service**:
   - Go to [https://dashboard.render.com/](https://dashboard.render.com/)
   - Click **+ New** > **Web Service**.
   - Select **Build and deploy from a Git repository** > Click **Next**.
   - Select your repository: **`commerce-admin-dashboard`**.

2. **Basic Settings**:
   - **Name**: `mile-infinity-store` (or any name)
   - **Language / Runtime**: `Node`
   - **Region**: Singapore (Southeast Asia - closest to India) or Frankfurt / Oregon
   - **Branch**: `main`
   - **Root Directory**: Leave blank (defaults to root `/`)
   - **Build Command**:
     ```bash
     NITRO_PRESET=node-server npm run build
     ```
   - **Start Command**:
     ```bash
     node .output/server/index.mjs
     ```

3. **Instance Type**:
   - Select **Free** (0.5 CPU, 512 MB RAM).

4. **Environment Variables** (Add under "Environment Variables"):
   | Key | Value |
   |---|---|
   | `NODE_VERSION` | `20` |
   | `NITRO_PRESET` | `node-server` |
   | `SUPABASE_URL` | `https://howaceawpfbuthzdajdk.supabase.co` |
   | `VITE_SUPABASE_URL` | `https://howaceawpfbuthzdajdk.supabase.co` |
   | `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT` |
   | `RAZORPAY_KEY_ID` | `rzp_test_TsreDTx2vLmBw1` |
   | `VITE_RAZORPAY_KEY_ID` | `rzp_test_TsreDTx2vLmBw1` |

5. **Deploy**:
   - Click **Create Web Service**.
   - Render will build and deploy your live store with full server-side rendering, Razorpay integration, and Supabase database connection!
