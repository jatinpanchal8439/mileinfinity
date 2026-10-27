import { useState } from "react";
import {
  Server,
  Cloud,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Zap,
  Globe,
  Key,
  Database,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function HostingDeploymentGuide() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const ENV_TEMPLATE = `# ========================================================
# MILE INFINITY PRODUCTION ENVIRONMENT VARIABLES (.env)
# ========================================================

# Storefront & Admin URLs
VITE_SITE_URL=https://your-domain.com
NODE_ENV=production

# Supabase PostgreSQL Database (Standard / Enterprise)
SUPABASE_URL=https://howaceawpfbuthzdajdk.supabase.co
VITE_SUPABASE_URL=https://howaceawpfbuthzdajdk.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_KUwQZumjzBkTo2TXfcgQzg_4s017KmT

# Razorpay Production API Keys (from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_live_your_actual_live_key_id
VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_live_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Shiprocket Production Logistics (from https://app.shiprocket.in)
SHIPROCKET_EMAIL=logistics@your-domain.com
SHIPROCKET_PASSWORD=your_shiprocket_secure_password
SHIPROCKET_TOKEN=your_shiprocket_bearer_token`;

  const VERCEL_STEPS = [
    "Push your project code to GitHub repository (Private or Public).",
    "Open https://vercel.com/new and click 'Import Git Repository'.",
    "Vercel will auto-detect Vite / TanStack Start. Keep Root Directory as `./`.",
    "Under 'Environment Variables', paste the `.env` values (especially RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET).",
    "Click 'Deploy'. Your full-stack eCommerce store will be live with free automatic SSL (HTTPS) within 90 seconds!",
  ];

  const CLOUDFLARE_STEPS = [
    "Run `bun run deploy` (or `npx wrangler deploy`) in terminal to publish live to Cloudflare Workers with edge assets.",
    "Or via Cloudflare Dashboard: Go to Workers & Pages -> Create Application -> Pages -> Connect to Git.",
    "Select your GitHub repository (`commerce-admin-dashboard`).",
    "Build Settings: Framework: None, Build command: `bun run build`, Output directory: `.output/public`.",
    "Add Environment Variables: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and RAZORPAY_KEY_ID.",
    "Add your custom domain with free automatic DDoS protection and SSL certificate.",
  ];

  const VPS_STEPS = [
    "Open https://railway.com and click '+ New Project' -> 'Deploy from GitHub repo'.",
    "Select your repository: `commerce-admin-dashboard`.",
    "Add Variables in Railway: `NITRO_PRESET=node-server`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `RAZORPAY_KEY_ID`.",
    "Railway automatically reads `railway.json` and runs full-stack Node SSR via `.output/server/index.mjs`.",
    "Under 'Settings' -> 'Networking', click 'Generate Domain' to get your instant live HTTPS URL.",
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0f3d24] to-[#165030] text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/20">
            ★ Production Deployment Manual
          </span>
          <span className="px-3 py-1 rounded-full bg-[#c49838] text-slate-900 text-xs font-bold uppercase tracking-wider">
            Ready to Go Live
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          How to Host & Launch Your eCommerce Store Live
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Follow this step-by-step blueprint to host your TanStack Start + Nitro full-stack app on
          Vercel, Cloudflare, or a VPS, and connect your real Razorpay merchant account to accept real customer payments.
        </p>
      </div>

      {/* Step 1: Real Razorpay Go-Live */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Step 1: Real Razorpay Account Activation & API Keys
            </h3>
            <p className="text-xs text-slate-500">
              How to transition from Test Sandbox to Live Production payments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0f3d24] text-white flex items-center justify-center text-xs">
                1
              </span>
              Complete Merchant KYC
            </span>
            <p className="text-slate-600 leading-relaxed">
              Login to{" "}
              <a
                href="https://dashboard.razorpay.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5"
              >
                dashboard.razorpay.com <ExternalLink className="w-3 h-3" />
              </a>
              , submit your Business PAN, Bank Account for auto-settlements, and GSTIN.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0f3d24] text-white flex items-center justify-center text-xs">
                2
              </span>
              Generate Live API Key Pair
            </span>
            <p className="text-slate-600 leading-relaxed">
              In Razorpay Dashboard, toggle the top switch to <strong>Live Mode</strong> &rarr; Go to{" "}
              <strong>Settings &rarr; API Keys</strong> &rarr; Click <strong>Generate Key</strong>.
              Copy the <code className="bg-slate-200 px-1 rounded">Key ID</code> and{" "}
              <code className="bg-slate-200 px-1 rounded">Key Secret</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#0f3d24] text-white flex items-center justify-center text-xs">
                3
              </span>
              Paste in Admin Settings Tab
            </span>
            <p className="text-slate-600 leading-relaxed">
              Go to <strong>Settings & Integrations</strong> in this admin panel, switch mode to{" "}
              <strong>Live Mode</strong>, paste the credentials, and click <strong>Save</strong>.
              Your customers can now pay via real UPI, Cards & Netbanking!
            </p>
          </div>
        </div>
      </div>

      {/* Step 2: Hosting Platform Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vercel Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                ▲
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Vercel (Recommended)</h4>
                <p className="text-[11px] text-slate-500">Fastest 1-Click Zero Config Deployment</p>
              </div>
            </div>

            <ol className="mt-4 space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              {VERCEL_STEPS.map((s, idx) => (
                <li key={idx} className="pl-1">
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-black text-white text-xs font-semibold text-center hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Deploy on Vercel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Cloudflare Pages */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Cloudflare Pages</h4>
                <p className="text-[11px] text-slate-500">Unlimited Edge Bandwidth & Global CDN</p>
              </div>
            </div>

            <ol className="mt-4 space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              {CLOUDFLARE_STEPS.map((s, idx) => (
                <li key={idx} className="pl-1">
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <a
            href="https://dash.cloudflare.com/"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-orange-500 text-white text-xs font-semibold text-center hover:bg-orange-600 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Open Cloudflare Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* VPS / Railway */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">VPS / Railway / Render</h4>
                <p className="text-[11px] text-slate-500">Dedicated Node/Bun Full Stack Server</p>
              </div>
            </div>

            <ol className="mt-4 space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              {VPS_STEPS.map((s, idx) => (
                <li key={idx} className="pl-1">
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href="https://railway.app"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-purple-600 text-white text-xs font-semibold text-center hover:bg-purple-700 transition-all flex items-center justify-center gap-1"
            >
              <span>Railway</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://render.com"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold text-center hover:bg-black transition-all flex items-center justify-center gap-1"
            >
              <span>Render</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyable .env Template */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0f3d24]" />
            <h4 className="font-bold text-slate-900 text-sm">
              Copyable Production Environment Variables (.env)
            </h4>
          </div>

          <button
            onClick={() => copyText(ENV_TEMPLATE, "env")}
            className="px-3.5 py-1.5 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            {copiedKey === "env" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === "env" ? "Copied to Clipboard!" : "Copy .env Template"}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          {ENV_TEMPLATE}
        </pre>
      </div>
    </div>
  );
}
