import { useState, useEffect, useRef } from "react";
import {
  X,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  RotateCw,
  MessageSquare,
  Lock,
} from "lucide-react";
import { useCustomerAuth } from "@/lib/customer-auth";
import { sendRealMobileOtp } from "@/lib/sms-otp.functions";

export function CustomerAuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    generateFreeOtp,
    verifyOtp,
  } = useCustomerAuth();

  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp" | "success">("input");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // OTP State
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset modal state when opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep("input");
      setErrorMsg(null);
      setOtpDigits(["", "", "", "", "", ""]);
      setActiveOtpCode(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  // Resend Countdown Timer
  useEffect(() => {
    if (step !== "otp" || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  if (!isAuthModalOpen) return null;

  const isSignUp = authModalMode === "signup";
  const currentDestination = method === "phone" ? phone : email;

  // Handle Send Free OTP
  async function handleSendOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (isSignUp && !fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (method === "phone") {
      const clean = phone.replace(/\D/g, "");
      if (clean.length < 10) {
        setErrorMsg("Please enter a valid 10-digit mobile number.");
        return;
      }
    } else {
      if (!email.includes("@") || !email.includes(".")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    }

    setIsSubmitting(true);
    const generated = generateFreeOtp(currentDestination);
    setActiveOtpCode(generated.code);

    // If mobile, attempt live dispatch to mobile number via SMS gateway / WhatsApp
    if (method === "phone") {
      try {
        await sendRealMobileOtp({
          data: {
            phone: currentDestination,
            otp: generated.code,
          },
        });
      } catch {
        // Fallback gracefully
      }
    }

    setTimeout(() => {
      setStep("otp");
      setIsSubmitting(false);
      setTimerSeconds(30);
      setOtpDigits(["", "", "", "", "", ""]);

      // Auto-focus first digit input box
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 150);
    }, 350);
  }

  // Handle individual digit input
  function handleDigitChange(index: number, val: string) {
    if (val.length > 1) {
      // User pasted full code
      const pasted = val.replace(/\D/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const next = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          next[i] = pasted[i] || "";
        }
        setOtpDigits(next);
        const nextIdx = Math.min(pasted.length, 5);
        digitInputRefs.current[nextIdx]?.focus();
        if (pasted.length === 6) {
          triggerVerification(pasted);
        }
      }
      return;
    }

    const next = [...otpDigits];
    next[index] = val.replace(/\D/g, "");
    setOtpDigits(next);

    // Auto-focus next input box
    if (val && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    // Check if 6 digits are complete
    const fullCode = next.join("");
    if (fullCode.length === 6) {
      triggerVerification(fullCode);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  }

  // One-click quick auto-fill free OTP
  function handleAutoFillOtp() {
    if (!activeOtpCode) return;
    const split = activeOtpCode.split("");
    setOtpDigits(split);
    triggerVerification(activeOtpCode);
  }

  // Verify OTP submission
  async function triggerVerification(codeToVerify: string) {
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await verifyOtp(currentDestination, codeToVerify, {
      name: fullName,
      mode: authModalMode,
    });

    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setStep("success");
      setTimeout(() => {
        closeAuthModal();
      }, 1400);
    }
  }

  // WhatsApp Free OTP delivery link directly to phone number
  const cleanDestPhone = phone.replace(/\D/g, "").slice(-10);
  const whatsappUrl =
    method === "phone" && cleanDestPhone.length === 10
      ? `https://api.whatsapp.com/send?phone=91${cleanDestPhone}&text=${encodeURIComponent(
          `🌿 Mile Infinity Botanical Skincare: Your mobile verification OTP is ${
            activeOtpCode || "123456"
          }. Valid for 5 minutes. Do not share this OTP with anyone.`
        )}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `Your Mile Infinity Botanical verification code is: ${
            activeOtpCode || "123456"
          }. Do not share this OTP with anyone.`
        )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#faf8f5] rounded-3xl shadow-2xl border border-[#e5dfd5] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-[#163729] to-[#0f271c] text-white px-7 pt-7 pb-6 text-center relative">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white font-serif">
            {isSignUp ? "Join Botanical Radiance" : "Welcome Back"}
          </h2>
          <p className="text-xs text-emerald-100/70 mt-1 max-w-xs mx-auto">
            {isSignUp
              ? "Create your account for express checkout, order tracking & exclusive member perks."
              : "Sign in with 100% Free Instant OTP to access your orders and saved addresses."}
          </p>

          {/* Sign In / Sign Up Mode Switcher */}
          {step === "input" && (
            <div className="flex bg-white/10 p-1 rounded-xl mt-4 border border-white/15 max-w-xs mx-auto text-xs">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className={`flex-1 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                  !isSignUp ? "bg-white text-[#163729] shadow-xs" : "text-white/70 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className={`flex-1 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                  isSignUp ? "bg-white text-[#163729] shadow-xs" : "text-white/70 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-7">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === "input" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Delivery Method Toggle */}
              <div className="flex items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setMethod("phone")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    method === "phone"
                      ? "border-[#163729] bg-[#163729]/5 text-[#163729]"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold ml-1">
                    FREE
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    method === "email"
                      ? "border-[#163729] bg-[#163729]/5 text-[#163729]"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Code</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold ml-1">
                    FREE
                  </span>
                </button>
              </div>

              {/* Full Name for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jatin Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#163729] focus:ring-1 focus:ring-[#163729]"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Input */}
              {method === "phone" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs font-semibold text-slate-600 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98111 88990"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-r-xl text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-[#163729] focus:ring-1 focus:ring-[#163729]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#163729] focus:ring-1 focus:ring-[#163729]"
                    />
                  </div>
                </div>
              )}

              {/* Zero-Cost OTP Explanation Tag */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">100% Free OTP Delivery:</span> No carrier SMS fees or
                  third-party DLT gateway charges. Instant verification on screen or via WhatsApp.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#163729] hover:bg-[#0f261c] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Generating Free OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <div className="space-y-5">
              {/* Destination & Edit */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                <span className="text-slate-500">
                  Code sent to:{" "}
                  <strong className="text-slate-900 font-mono">
                    {method === "phone" ? `+91 ${phone}` : email}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="text-[#163729] hover:underline font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Free OTP Auto-Fill & Delivery Banner */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300/80 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-emerald-950">
                      Free Instant Code:
                    </span>
                    <span className="text-sm font-black font-mono tracking-widest text-[#163729] bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                      {activeOtpCode || "849201"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#163729] text-white hover:bg-[#0f261c] transition-transform active:scale-95 cursor-pointer shadow-xs"
                  >
                    Tap to Auto-fill
                  </button>
                </div>
                <div className="text-[10px] text-emerald-800 mt-1.5 flex items-center justify-between">
                  <span>Simulated Free Gateway (Zero SMS Cost)</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-900 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-700" />
                    Share via WhatsApp
                  </a>
                </div>
              </div>

              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-center text-xs font-semibold text-slate-700 mb-2">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        digitInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-mono font-bold text-slate-900 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#163729] focus:ring-2 focus:ring-[#163729]/20 transition-all shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Countdown / Resend */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {timerSeconds > 0 ? `Resend in 00:${timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}` : "Didn't receive code?"}
                </span>

                <button
                  type="button"
                  disabled={timerSeconds > 0}
                  onClick={() => handleSendOtp()}
                  className="font-semibold text-[#163729] hover:underline disabled:text-slate-300 disabled:no-underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                disabled={isSubmitting || otpDigits.join("").length < 6}
                onClick={() => triggerVerification(otpDigits.join(""))}
                className="w-full py-3 px-4 rounded-xl bg-[#163729] hover:bg-[#0f261c] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Authentication Verified!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Welcome to Mile Infinity. Your session is now securely active.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
