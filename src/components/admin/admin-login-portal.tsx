import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Shield,
} from "lucide-react";
import logoImg from "@/assets/mile-infinity-logo.png";
import {
  AdminLoginSchema,
  verifyAdminCredentials,
  DEFAULT_ADMIN_CREDENTIALS,
  checkRateLimit,
  getOrCreateCsrfToken,
  type AdminSession,
} from "@/lib/security";

interface AdminLoginPortalProps {
  onLoginSuccess: (session: AdminSession) => void;
}

export function AdminLoginPortal({ onLoginSuccess }: AdminLoginPortalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [lockoutSec, setLockoutSec] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance
  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
      });
    }
  }, []);

  function triggerShake() {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: -8 },
      {
        x: 8,
        duration: 0.07,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          if (cardRef.current) gsap.set(cardRef.current, { x: 0 });
        },
      }
    );
  }

  useEffect(() => {
    setCsrfToken(getOrCreateCsrfToken());
    const rate = checkRateLimit();
    if (rate.isLocked) {
      setLockoutSec(rate.remainingLockoutSeconds);
    }
  }, []);

  // Countdown timer for lockout if any
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const timer = setInterval(() => {
      setLockoutSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMsg(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSec]);

  function handleAutoFill() {
    setEmail(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setErrorMsg(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // Check rate limit
    const rate = checkRateLimit();
    if (rate.isLocked) {
      setLockoutSec(rate.remainingLockoutSeconds);
      setErrorMsg(`Too many failed attempts. Locked for ${rate.remainingLockoutSeconds}s.`);
      return;
    }

    // 1. Zod input validation
    const validation = AdminLoginSchema.safeParse({ email, password, rememberMe });
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Invalid credentials format");
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = verifyAdminCredentials(validation.data);
      setIsSubmitting(false);

      if (result.success && result.session) {
        onLoginSuccess(result.session);
      } else {
        setErrorMsg(result.error || "Authentication failed. Check credentials.");
        triggerShake();
        const currentRate = checkRateLimit();
        if (currentRate.isLocked) {
          setLockoutSec(currentRate.remainingLockoutSeconds);
        }
      }
    }, 500);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-slate-200/80 mb-2">
            <img src={logoImg} alt="Mile Infinity" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-slate-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Secure administrative control center for Mile Infinity Commerce &amp; Razorpay Gateway
          </p>
        </div>

        {/* Login Card */}
        <div
          ref={cardRef}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5"
        >
          {/* Simple Professional Header */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-800">
              Store Manager Sign In
            </span>
            <span className="text-[11px] text-slate-400">
              Admin Access
            </span>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="rounded-xl bg-amber-50/80 border border-amber-200/70 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Demo Credentials Available
              </span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[10px] uppercase tracking-wider font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Click to Auto-fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-amber-800 space-y-0.5">
              <div>Email: <span className="font-semibold">{DEFAULT_ADMIN_CREDENTIALS.email}</span></div>
              <div>Pass: <span className="font-semibold">{DEFAULT_ADMIN_CREDENTIALS.password}</span></div>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="csrfToken" value={csrfToken} />

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@mileinfinity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={lockoutSec > 0 || isSubmitting}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24] focus:ring-1 focus:ring-[#0f3d24] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 block">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockoutSec > 0 || isSubmitting}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24] focus:ring-1 focus:ring-[#0f3d24] transition-all disabled:opacity-50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0f3d24] focus:ring-[#0f3d24] cursor-pointer"
                />
                <span>Remember session for 7 days</span>
              </label>

              <span className="text-[11px] text-slate-400">Encrypted AES-256</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={lockoutSec > 0 || isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] active:scale-[0.99] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : lockoutSec > 0 ? (
                <span>Locked for {lockoutSec}s</span>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 text-[#c49838]" />
                  <span>Authenticate &amp; Enter Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-3">
          <a
            href="/"
            className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
          >
            ← Return to Storefront
          </a>
          <span>•</span>
          <a
            href="/shop"
            className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
          >
            Shop Catalog <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
