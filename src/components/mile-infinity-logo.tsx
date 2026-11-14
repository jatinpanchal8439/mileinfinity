import React from "react";
import logoSvg from "@/assets/mile-infinity-logo.svg";
import logoPng from "@/assets/mile-infinity-logo.png";

interface MileInfinityLogoProps {
  className?: string;
  variant?: "dark" | "light";
  height?: number | string;
  width?: number | string;
}

/**
 * Mile Infinity High-Resolution Vector Brand Logo Component
 * - 100% razor sharp at any screen density (Retina 2x/3x/4K)
 * - Pure SVG vector geometry for both the typography (MILE, INFINITY) and the iconic diamond infinity emblem
 */
export function MileInfinityLogo({
  className = "h-10 w-auto",
  variant = "dark",
  height,
  width,
}: MileInfinityLogoProps) {
  const fillColor = variant === "light" ? "#f7f4ee" : "#162e21";

  return (
    <img
      src={logoSvg}
      alt="Mile Infinity"
      height={height}
      width={width}
      className={`object-contain select-none ${className}`}
      style={{
        imageRendering: "crisp-edges",
      }}
      onError={(e) => {
        // Fallback to high-res 1168x640 PNG if SVG fails to load
        (e.currentTarget as HTMLImageElement).src = logoPng;
      }}
    />
  );
}

export default MileInfinityLogo;

