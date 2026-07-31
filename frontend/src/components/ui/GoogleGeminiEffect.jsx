import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

const STREAM_COLORS = [
  "#FFB7C5", // Row 0: Autonomy (Rose/Pink)
  "#FFDDB7", // Row 1: Workflow (Gold/Amber)
  "#B1C5FF", // Row 2: Learning (Soft Blue)
  "#4FABFF", // Row 3: Integration (Cyan)
  "#076EFF", // Row 4: Outcomes (Electric Blue)
];

const transition = {
  duration: 0,
  ease: "linear",
};

export const GoogleGeminiEffect = ({
  pathLengths,
  hoveredRow = null,
  className,
}) => {
  // SVG coordinates for 5 synced rows (viewBox 0 0 1000 600)
  // Left card edge ~ 450, Center ~ 500, Right card edge ~ 550
  const rowY = [160, 240, 320, 400, 480];

  return (
    <div className={cn("absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible", className)}>
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <filter id="geminiGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {rowY.map((y, i) => {
          const color = STREAM_COLORS[i];
          const isHovered = hoveredRow === i;
          const strokeWidth = isHovered ? 5 : 3;
          const opacity = hoveredRow !== null ? (isHovered ? 1 : 0.25) : 0.85;
          const pLength = pathLengths?.[i] ?? 1;

          // Smooth S-curve bezier from Left Row Y_i -> Center Braided Node -> Right Row Y_i
          // Path starts at Left Card row, weaves through central transition button (500, 320), and connects to Right Card row
          const pathD = `M 80 ${y} L 440 ${y} C 470 ${y}, 485 ${320 + (i - 2) * 12}, 500 320 C 515 ${320 - (i - 2) * 12}, 530 ${y}, 560 ${y} L 920 ${y}`;

          return (
            <g key={i}>
              {/* Outer Glow Halo Path */}
              <motion.path
                d={pathD}
                stroke={color}
                strokeWidth={strokeWidth * 2.2}
                strokeLinecap="round"
                fill="none"
                opacity={isHovered ? 0.6 : 0.2}
                filter="url(#geminiGlow)"
              />

              {/* Main Stream Path */}
              <motion.path
                d={pathD}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
                opacity={opacity}
                initial={{ pathLength: 0 }}
                style={{ pathLength: pLength }}
                transition={transition}
              />

              {/* Animated Action Potential Pulses (Electricity Flowing Left -> Right) */}
              <motion.path
                d={pathD}
                stroke="#ffffff"
                strokeWidth={strokeWidth + 1}
                strokeDasharray={isHovered ? "40 120" : "24 160"}
                strokeLinecap="round"
                fill="none"
                opacity={isHovered ? 1 : 0.75}
                animate={{ strokeDashoffset: [360, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: isHovered ? 2.5 : 4.5,
                  ease: "linear",
                }}
                filter="url(#geminiGlow)"
              />

              {/* Socket Connector Node on Left Card (Row Origin) */}
              <circle
                cx={440}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={color}
                opacity={opacity}
                className="transition-all duration-300"
              />
              <circle
                cx={440}
                cy={y}
                r={isHovered ? 10 : 6}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                opacity={isHovered ? 0.9 : 0.4}
              />

              {/* Socket Connector Node on Right Card (Row Destination) */}
              <circle
                cx={560}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={color}
                opacity={opacity}
                className="transition-all duration-300"
              />
              <circle
                cx={560}
                cy={y}
                r={isHovered ? 10 : 6}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                opacity={isHovered ? 0.9 : 0.4}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
