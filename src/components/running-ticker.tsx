interface RunningTickerProps {
  variant?: "dark" | "cream" | "gold";
  className?: string;
  speed?: "normal" | "slow" | "fast";
}

const DEFAULT_ITEMS = [
  "PLANT-BASED FORMULATIONS",
  "CRUELTY-FREE",
  "THOUGHTFULLY CRAFTED",
];

export function RunningTicker({
  variant = "dark",
  className = "",
}: RunningTickerProps) {
  // Multiply items so the loop is always continuous and wide enough for any viewport
  const repeatedItems = [...DEFAULT_ITEMS, ...DEFAULT_ITEMS, ...DEFAULT_ITEMS];

  const variantStyles = {
    dark: "bg-[#0f241a] text-[#f7f5ef] border-[#183a2a]",
    cream: "bg-[#f5f1ea] text-[#162e21] border-[#e2dcce]",
    gold: "bg-[#162e21] text-[#e8d7b8] border-[#244b36]",
  };

  const plusStyles = {
    dark: "text-emerald-400/90",
    cream: "text-[#8e6833]",
    gold: "text-[#c49838]",
  };

  return (
    <div
      className={`relative w-full overflow-hidden border-y py-3.5 sm:py-4 select-none ${variantStyles[variant]} ${className}`}
      aria-label="Running ticker banner"
    >
      <div className="flex animate-marquee">
        {/* First Half */}
        <div className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
          {repeatedItems.map((item, idx) => (
            <div key={`set1-${idx}`} className="flex items-center gap-8 sm:gap-12 shrink-0">
              <span
                className={`font-serif text-base sm:text-lg font-light leading-none ${plusStyles[variant]}`}
                aria-hidden="true"
              >
                +
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase whitespace-nowrap font-sans">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Second Duplicate Half for seamless infinite animation */}
        <div className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12" aria-hidden="true">
          {repeatedItems.map((item, idx) => (
            <div key={`set2-${idx}`} className="flex items-center gap-8 sm:gap-12 shrink-0">
              <span
                className={`font-serif text-base sm:text-lg font-light leading-none ${plusStyles[variant]}`}
              >
                +
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase whitespace-nowrap font-sans">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
