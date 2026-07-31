import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

const STREAM_COLORS = [
  "#38BDF8", // 0: Autonomy (Cyan)
  "#818CF8", // 1: Workflow (Indigo)
  "#A855F7", // 2: Learning (Purple)
  "#F472B6", // 3: Integration (Pink)
  "#FB923C", // 4: Outcomes (Amber)
];

// Exact Bezier curves matching the 5 card rows (Y: 70, 185, 300, 415, 530)
// converging through the center transition node (500, 300)
const STREAM_PATHS = [
  "M 0,70 L 380,70 C 450,70 470,300 500,300 C 530,300 550,70 620,70 L 1000,70",     // 0: Autonomy
  "M 0,185 L 380,185 C 450,185 470,300 500,300 C 530,300 550,185 620,185 L 1000,185", // 1: Workflow
  "M 0,300 L 380,300 C 450,300 480,300 500,300 C 520,300 550,300 620,300 L 1000,300", // 2: Learning
  "M 0,415 L 380,415 C 450,415 470,300 500,300 C 530,300 550,415 620,415 L 1000,415", // 3: Integration
  "M 0,530 L 380,530 C 450,530 470,300 500,300 C 530,300 550,530 620,530 L 1000,530", // 4: Outcomes
];

const transition = {
  duration: 0,
  ease: "linear",
};

export const GoogleGeminiEffect = ({
  pathLengths = [],
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
        <defs>
          <filter id="gemini-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render 5 Ecosystem Streams synced to the 5 Card Rows */}
        {STREAM_PATHS.map((d, i) => {
          const color = STREAM_COLORS[i];
          const isHovered = hoveredRow === i;
          const isAnyHovered = hoveredRow !== null;
          const pathLen = pathLengths[i] ?? 1;

          // Opacity & width dynamically adjust based on row hover ecosystem state
          let opacity = 0.35;
          let strokeWidth = 2.5;

          if (isHovered) {
            opacity = 1.0;
            strokeWidth = 5.5;
          } else if (isAnyHovered) {
            opacity = 0.15;
            strokeWidth = 1.5;
          }

          return (
            <g key={i}>
              {/* Outer Glow Halo Path (active on hover or high progress) */}
              {isHovered && (
                <motion.path
                  d={d}
                  stroke={color}
                  strokeWidth={12}
                  fill="none"
                  filter="url(#gemini-glow)"
                  opacity={0.6}
                  transition={transition}
                />
              )}

              {/* Base Gemini Stream Path */}
              <motion.path
                d={d}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                initial={{ pathLength: 0 }}
                style={{ pathLength: pathLen }}
                opacity={opacity}
                transition={transition}
              />

              {/* Action Potential Fast Energy Pulse (Flowing Left -> Right) */}
              <motion.path
                d={d}
                stroke="#ffffff"
                strokeWidth={strokeWidth * 0.8}
                strokeDasharray="30 180"
                fill="none"
                opacity={isHovered ? 0.95 : 0.4}
                animate={{ strokeDashoffset: [210, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: isHovered ? 2.5 : 5 + i * 0.8,
                  ease: "linear",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
