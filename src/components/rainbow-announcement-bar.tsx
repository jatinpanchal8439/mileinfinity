import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Top Pastel Rainbow Continuous Running Ticker Carousel
 * - Continuous infinite horizontal running marquee ticker across all screen sizes
 * - Multi-colored pastel segments: mint, peach, rose, lavender, sky-blue
 * - Pauses on hover for comfortable reading & interaction
 * - Clickable promo code "GLOW20" with copy-to-clipboard toast feedback
 */
export function RainbowAnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText("GLOW20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const segments = [
    {
      bg: "bg-[#dceddf]",
      textColor: "text-[#1b3829]",
      text: "UP TO 20% OFF [ USE CODE: GLOW20 ]",
      hasCode: true,
    },
    {
      bg: "bg-[#fbedda]",
      textColor: "text-[#4a341b]",
      text: "BUY 2 GET 1 FREE",
      hasCode: false,
    },
    {
      bg: "bg-[#f8dedc]",
      textColor: "text-[#4a242a]",
      text: "UP TO 20% OFF [ USE CODE: GLOW20 ]",
      hasCode: true,
    },
    {
      bg: "bg-[#ecddf2]",
      textColor: "text-[#3f254b]",
      text: "BUY 2 GET 1 FREE",
      hasCode: false,
    },
    {
      bg: "bg-[#dce9f5]",
      textColor: "text-[#1d3345]",
      text: "UP TO 20% OFF [ USE CODE: GLOW20 ]",
      hasCode: true,
    },
  ];

  const renderSegment = (seg: (typeof segments)[0], key: string | number) => (
    <div
      key={key}
      className={`${seg.bg} ${seg.textColor} flex h-full items-center justify-center gap-2 px-4 xs:px-6 sm:px-8 shrink-0 transition-colors duration-200 text-[10px] xs:text-[11px] sm:text-xs`}
    >
      {seg.hasCode ? (
        <button
          type="button"
          onClick={copyCode}
          className="group/btn inline-flex items-center gap-1.5 xs:gap-2 cursor-pointer font-semibold uppercase tracking-[0.06em] xs:tracking-[0.08em] transition-transform duration-200 hover:scale-[1.02]"
          title="Click to copy promo code GLOW20"
        >
          <span>
            UP TO 20% OFF [ USE CODE:{" "}
            <strong className="font-extrabold underline decoration-dotted underline-offset-4 group-hover/btn:text-black">
              GLOW20
            </strong>{" "}
            ]
          </span>
          <Copy className="h-3 w-3 opacity-60 group-hover/btn:opacity-100 transition-opacity shrink-0" />
        </button>
      ) : (
        <div className="flex items-center gap-1.5 xs:gap-2 font-semibold uppercase tracking-[0.06em] xs:tracking-[0.08em]">
          <span className="text-[11px] xs:text-[12px] opacity-80" aria-hidden="true">
            🪷
          </span>
          <span>{seg.text}</span>
          <span className="text-[11px] xs:text-[12px] opacity-80" aria-hidden="true">
            🪷
          </span>
        </div>
      )}
    </div>
  );

  return (
    <aside
      className="relative w-full overflow-hidden select-none z-50 border-b border-black/5 bg-[#f5f1ea]"
      aria-label="Promotions and offers"
    >
      {/* Toast Notification when code is copied */}
      {copied && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#162e21] text-white px-4 xs:px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 max-w-[92vw] text-center">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="truncate">Code &quot;GLOW20&quot; copied! (20% OFF applied)</span>
        </div>
      )}

      {/* Continuous Running Carousel / Ticker for All Devices */}
      <div className="flex h-7 xs:h-8 sm:h-9 overflow-hidden text-[10px] xs:text-[11px] sm:text-xs">
        <div className="flex animate-marquee shrink-0 items-center h-full">
          {/* First set of segments */}
          <div className="flex shrink-0 items-center h-full">
            {segments.map((seg, i) => renderSegment(seg, `seg-a-${i}`))}
          </div>

          {/* Second duplicate set for seamless infinite 100% loop */}
          <div className="flex shrink-0 items-center h-full" aria-hidden="true">
            {segments.map((seg, i) => renderSegment(seg, `seg-b-${i}`))}
          </div>
        </div>
      </div>
    </aside>
  );
}
