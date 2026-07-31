import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

const transition = {
  duration: 0,
  ease: "linear",
};

const STREAM_COLORS = [
  '#076EFF', // Row 0: AUTONOMY (Electric Blue)
  '#38bdf8', // Row 1: WORKFLOW (Cyan Sky)
  '#a855f7', // Row 2: LEARNING (Purple Synapse)
  '#f59e0b', // Row 3: INTEGRATION (Amber Spark)
  '#ec4899', // Row 4: OUTCOMES (Neon Pink)
];

const ROW_Y_POSITIONS = [110, 205, 300, 395, 490];

export const GoogleGeminiEffect = ({
  pathLengths,
  hoveredRow = null,
  className,
}) => {
  return (
    <div className={cn("absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0", className)}>
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {ROW_Y_POSITIONS.map((y, i) => {
          const color = STREAM_COLORS[i];
          const isHovered = hoveredRow === i;
          const isAnyHovered = hoveredRow !== null;
          const isDimmed = isAnyHovered && !isHovered;

          // Path originating at Left Row i (X=220), curving to Center Node (500, 300), and curving to Right Row i (X=780)
          const pathD = `M 0 ${y} L 220 ${y} C 360 ${y}, 430 300, 500 300 C 570 300, 640 ${y}, 780 ${y} L 1000 ${y}`;
          const pathLength = pathLengths?.[i] ?? 1;

          return (
            <g key={i} className="transition-opacity duration-300">
              {/* Base Synced Gemini Flow Path */}
              <motion.path
                d={pathD}
                stroke={color}
                strokeWidth={isHovered ? "5" : "3"}
                strokeOpacity={isDimmed ? 0.2 : isHovered ? 1.0 : 0.75}
                fill="none"
                initial={{ pathLength: 0 }}
                style={{ pathLength }}
                transition={transition}
              />

              {/* Glowing Aura for Hovered Path */}
              {isHovered && (
                <motion.path
                  d={pathD}
                  stroke={color}
                  strokeWidth="10"
                  strokeOpacity={0.6}
                  fill="none"
                  filter="url(#geminiGlowFilter)"
                />
              )}

              {/* Animated Action Potential Pulse Stream (Data Flowing Left -> Right) */}
              <motion.path
                d={pathD}
                stroke="#ffffff"
                strokeWidth={isHovered ? "4" : "2.5"}
                strokeDasharray="25 150"
                strokeOpacity={isDimmed ? 0.1 : 0.9}
                fill="none"
                animate={{ strokeDashoffset: [200, 0] }}
                transition={{ repeat: Infinity, duration: isHovered ? 2.5 : 5 + i * 0.8, ease: "linear" }}
                filter="url(#geminiGlowFilter)"
              />

              {/* Connection Anchor Nodes at Left Card Row i */}
              <circle
                cx="220"
                cy={y}
                r={isHovered ? "6" : "4"}
                fill={color}
                opacity={isDimmed ? 0.3 : 0.95}
              />

              {/* Connection Anchor Nodes at Right Card Row i */}
              <circle
                cx="780"
                cy={y}
                r={isHovered ? "6" : "4"}
                fill={color}
                opacity={isDimmed ? 0.3 : 0.95}
              />
            </g>
          );
        })}

        <defs>
          <filter id="geminiGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
