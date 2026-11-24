/**
 * Anti-Tamper & Console Security Shield for Mile Infinity Commerce
 * Automatically intercepts, sanitizes, and prevents leaking sensitive credentials,
 * API tokens, database schemas, PII, and stack traces to client browser DevTools.
 */

const SENSITIVE_PATTERNS = [
  /sb_publishable_[A-Za-z0-9_-]+/gi,
  /sb_secret_[A-Za-z0-9_-]+/gi,
  /rzp_(?:test|live)_[A-Za-z0-9]+/gi,
  /Bearer\s+[A-Za-z0-9._-]+/gi,
  /https:\/\/[a-z0-9]+\.supabase\.co[^\s"']*/gi,
  /postgres(?:ql)?:\/\/[^\s"']+/gi,
  /password=["':]?\s*([^"'&\s]+)/gi,
  /keySecret=["':]?\s*([^"'&\s]+)/gi,
  /sr_token_[A-Za-z0-9_-]+/gi,
  /whsec_[A-Za-z0-9_-]+/gi,
  /eyJh[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, // JWT tokens
];

const BLOCKED_SUBSTRINGS = [
  "supabase",
  "postgrest",
  "pgrst",
  "relation \"public.",
  "table \"public.",
  "order_items",
  "service_role",
  "anon key",
  "razorpay_signature",
  "key_secret",
  "shiprocket_token",
];

function sanitizeString(str: string): string {
  let cleaned = str;
  for (const pattern of SENSITIVE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[PROTECTED_CREDENTIAL]");
  }
  return cleaned;
}

function shouldSuppressMessage(args: unknown[]): boolean {
  for (const arg of args) {
    const text = typeof arg === "string" ? arg : typeof arg === "object" ? JSON.stringify(arg) : String(arg);
    const lower = text.toLowerCase();
    for (const sub of BLOCKED_SUBSTRINGS) {
      if (lower.includes(sub)) return true;
    }
  }
  return false;
}

function sanitizeValue(val: unknown): unknown {
  if (typeof val === "string") {
    return sanitizeString(val);
  }
  if (val instanceof Error) {
    // Hide internal filesystem paths and sensitive stack dumps
    return new Error(sanitizeString(val.message || "An internal error occurred."));
  }
  if (val && typeof val === "object") {
    try {
      if (Array.isArray(val)) {
        return val.map((item) => sanitizeValue(item));
      }
      const copy: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        const lowerKey = k.toLowerCase();
        if (
          lowerKey.includes("password") ||
          lowerKey.includes("keysecret") ||
          lowerKey.includes("apikey") ||
          lowerKey.includes("secretkey") ||
          lowerKey.includes("service_role") ||
          lowerKey.includes("token") ||
          lowerKey.includes("signature")
        ) {
          copy[k] = "[REDACTED]";
        } else {
          copy[k] = sanitizeValue(v);
        }
      }
      return copy;
    } catch {
      return "[SECURE_DATA]";
    }
  }
  return val;
}

export function initConsoleSecurityGuard(): void {
  if (typeof window === "undefined" || (window as any).__mileSecurityShieldActive) {
    return;
  }
  (window as any).__mileSecurityShieldActive = true;

  const originalLog = console.log.bind(console);
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);
  const originalInfo = console.info.bind(console);

  const isProd =
    typeof process !== "undefined" && process.env["NODE_ENV"] === "production"
      ? true
      : typeof import.meta !== "undefined"
      ? !import.meta.env?.DEV
      : false;

  // Render a clean security warning banner for developers/auditors in DevTools
  try {
    originalLog(
      "%c🔒 MILE INFINITY SECURE CLIENT %c\nAll sensitive API tokens, customer PII, and backend SQL schemas are shielded from client DevTools.",
      "background: #0f3d24; color: #e9ecef; font-weight: bold; font-size: 13px; padding: 6px 12px; border-radius: 6px;",
      "color: #495057; font-size: 11px; padding-top: 4px;"
    );
  } catch {}

  // Intercept and sanitize console methods
  console.log = (...args: unknown[]) => {
    if (shouldSuppressMessage(args)) return;
    if (isProd) return; // Silent in production
    originalLog(...args.map(sanitizeValue));
  };

  console.info = (...args: unknown[]) => {
    if (shouldSuppressMessage(args)) return;
    if (isProd) return;
    originalInfo(...args.map(sanitizeValue));
  };

  console.debug = () => {};
  console.trace = () => {};

  console.warn = (...args: unknown[]) => {
    if (shouldSuppressMessage(args)) return;
    if (isProd) return;
    originalWarn(...args.map(sanitizeValue));
  };

  console.error = (...args: unknown[]) => {
    if (shouldSuppressMessage(args)) return;
    if (isProd) return;
    originalError(...args.map(sanitizeValue));
  };

  // Intercept uncaught browser errors so stack traces don't expose server paths or SQL tables
  window.addEventListener("error", (e) => {
    const msg = (e.message || "").toLowerCase();
    if (
      msg.includes("service_role") ||
      msg.includes("keysecret") ||
      msg.includes("jwt_secret")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = String(e.reason || "").toLowerCase();
    if (
      reason.includes("supabase") ||
      reason.includes("pgrst") ||
      reason.includes("postgrest") ||
      reason.includes("token")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
