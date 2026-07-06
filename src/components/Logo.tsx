import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: "light" | "dark";
}

export default function Logo({ className = "", iconOnly = false, variant = "light" }: LogoProps) {
  // SVG of the official logo:
  // - Top-right bracket: starts around (11, 2), curves to (20, 11), goes down to (20, 20) with a gradient
  // - Bottom-left bracket: starts around (11, 20), curves to (2, 11), goes up to (2, 2) with a gradient
  // - Smiley face in the middle: eyes at (8, 9) and (14, 9), smile path from (8, 12) curve to (11, 15) to (14, 12)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Novamente Logo Icon (SVG) */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#5e3bdb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Top-right bracket/frame */}
        <path
          d="M 50 10 
             L 75 10 
             A 15 15 0 0 1 90 25 
             L 90 65 
             L 78 65 
             L 78 22 
             L 50 22 
             Z"
          fill="url(#logoGrad)"
        />

        {/* Bottom-left bracket/frame */}
        <path
          d="M 50 90 
             L 25 90 
             A 15 15 0 0 1 10 75 
             L 10 35 
             L 22 35 
             L 22 78 
             L 50 78 
             Z"
          fill="url(#logoGrad)"
        />

        {/* Smiley Face Eyes */}
        <circle cx="36" cy="43" r="6" fill="#5e3bdb" />
        <circle cx="64" cy="43" r="6" fill="#5e3bdb" />

        {/* Smiley Face Smile (Thick curve U shape) */}
        <path
          d="M 36 55 A 14 14 0 0 0 64 55"
          stroke="#5e3bdb"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span className="text-[25px] font-normal tracking-tight text-[#5e3bdb]">nova</span>
            <span className="text-[25px] font-bold tracking-tight text-[#5e3bdb]">mente</span>
          </div>
          <span className="text-[7.5px] font-semibold tracking-[0.34em] text-zinc-500 uppercase mt-0.5 whitespace-nowrap">
            CENTRO TERAPÉUTICO
          </span>
        </div>
      )}
    </div>
  );
}
