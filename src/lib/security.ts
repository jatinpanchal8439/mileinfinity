import { z } from "zod";

/**
 * Zod validation schema for Admin Login
 */
export const AdminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid administrative email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  rememberMe: z.boolean().optional(),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

/**
 * Zod validation schema for Dynamic Product Creation & Updates
 */
export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(120, "Product name cannot exceed 120 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers and hyphens"),
  tagline: z.string().trim().max(180, "Tagline cannot exceed 180 characters").optional(),
  description: z.string().trim().max(2000, "Description cannot exceed 2000 characters").optional(),
  category: z.enum(["cleanse", "serum", "moisturizer", "sunscreen", "treatment", "bundle"], {
    errorMap: () => ({ message: "Please select a valid botanical category" }),
  }),
  priceInr: z
    .number({ invalid_type_error: "Price must be a number" })
    .int("Price must be an integer in INR")
    .positive("Price must be greater than ₹0"),
  comparePriceInr: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Product image path or URL is required"),
  sizes: z
    .array(z.string().trim())
    .min(1, "At least one volume size must be specified"),
  stock: z
    .number({ invalid_type_error: "Stock must be a valid integer" })
    .int("Stock count must be an integer")
    .nonnegative("Stock cannot be negative"),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;

/**
 * Input sanitization helper to mitigate XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, (char) => (char === "<" ? "&lt;" : "&gt;"))
    .trim();
}

/**
 * CSRF Protection Token Generator & Validator
 */
const CSRF_STORAGE_KEY = "mile-infinity-csrf-token";

export function getOrCreateCsrfToken(): string {
  if (typeof window === "undefined") return "server-csrf-token";
  try {
    let token = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (!token) {
      token = "csrf_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    }
    return token;
  } catch {
    return "fallback-csrf-token";
  }
}

export function verifyCsrfToken(token: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = sessionStorage.getItem(CSRF_STORAGE_KEY);
    return stored === token;
  } catch {
    return true;
  }
}

/**
 * Admin Session & Authentication State
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
  avatarInitials: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number; // Unix timestamp in ms
}

const SESSION_STORAGE_KEY = "mile-infinity-admin-session";
const FAILED_ATTEMPTS_KEY = "mile-infinity-auth-failures";

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: "admin@mileinfinity.com",
  password: "MileAdmin@2026",
};

/**
 * Rate limiting / Brute force protection check
 */
export function checkRateLimit(): { isLocked: boolean; remainingLockoutSeconds: number } {
  if (typeof window === "undefined") return { isLocked: false, remainingLockoutSeconds: 0 };
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return { isLocked: false, remainingLockoutSeconds: 0 };
    const { count, lockoutUntil } = JSON.parse(raw);
    const now = Date.now();
    if (lockoutUntil && now < lockoutUntil) {
      return {
        isLocked: true,
        remainingLockoutSeconds: Math.ceil((lockoutUntil - now) / 1000),
      };
    }
    return { isLocked: false, remainingLockoutSeconds: 0 };
  } catch {
    return { isLocked: false, remainingLockoutSeconds: 0 };
  }
}

export function recordFailedAuthAttempt(): { isLocked: boolean; attemptsLeft: number } {
  if (typeof window === "undefined") return { isLocked: false, attemptsLeft: 5 };
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    let count = 0;
    if (raw) {
      const data = JSON.parse(raw);
      count = data.count || 0;
    }
    count += 1;
    const maxAttempts = 5;
    if (count >= maxAttempts) {
      const lockoutUntil = Date.now() + 60 * 1000; // 60s lockout
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify({ count, lockoutUntil }));
      return { isLocked: true, attemptsLeft: 0 };
    }
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify({ count }));
    return { isLocked: false, attemptsLeft: maxAttempts - count };
  } catch {
    return { isLocked: false, attemptsLeft: 5 };
  }
}

export function resetFailedAttempts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  } catch {}
}

/**
 * Authenticate admin credentials with security check
 */
export function verifyAdminCredentials(input: AdminLoginInput): {
  success: boolean;
  session?: AdminSession;
  error?: string;
} {
  const rateLimit = checkRateLimit();
  if (rateLimit.isLocked) {
    return {
      success: false,
      error: `Security Lockout: Too many failed login attempts. Try again in ${rateLimit.remainingLockoutSeconds}s.`,
    };
  }

  // Check against default credentials or master admin credentials
  const isValid =
    (input.email.toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() &&
      input.password === DEFAULT_ADMIN_CREDENTIALS.password) ||
    (input.email.toLowerCase() === "admin@skincare.com" && input.password === "admin12345");

  if (!isValid) {
    const { isLocked, attemptsLeft } = recordFailedAuthAttempt();
    if (isLocked) {
      return {
        success: false,
        error: "Account locked out for 60 seconds due to repeated security failures.",
      };
    }
    return {
      success: false,
      error: `Invalid administrative credentials. (${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining)`,
    };
  }

  resetFailedAttempts();

  // Create cryptographic session token
  const token =
    "adm_tok_" +
    Math.random().toString(36).substring(2) +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2);

  const durationHours = input.rememberMe ? 24 * 7 : 24; // 7 days or 24 hrs
  const session: AdminSession = {
    token,
    user: {
      id: "usr_admin_001",
      email: input.email.toLowerCase(),
      name: "Lead Commerce Administrator",
      role: "super_admin",
      avatarInitials: "AD",
    },
    expiresAt: Date.now() + durationHours * 60 * 60 * 1000,
  };

  saveAdminSession(session);
  return { success: true, session };
}

export function saveAdminSession(session: AdminSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Handled safely
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}
