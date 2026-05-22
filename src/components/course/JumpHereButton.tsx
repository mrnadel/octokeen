'use client';

import { motion } from 'framer-motion';
import { type UnitTheme } from '@/lib/unitThemes';

/** 3D floating "Jump here" button — two-layer SVG so the face presses into the base on tap */
export function JumpHereButton({ theme, onClick }: { theme: UnitTheme; onClick: () => void }) {
  const BTN_W = 160;
  const BTN_H = 54;
  const DEPTH = 6; // 3D extrusion depth in px

  return (
    <motion.div
      className="flex justify-center"
      style={{ margin: '-4px 0 4px', position: 'relative', zIndex: 2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <motion.button
        onClick={onClick}
        className="relative select-none"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          width: BTN_W,
          height: BTN_H,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18)) drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
        }}
        initial="rest"
        whileHover="hover"
        whileTap="pressed"
        variants={{
          rest: {
            y: [0, -6, 0],
            transition: { y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
          },
          hover: {
            y: [0, -6, 0],
            transition: { y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
          },
          pressed: {
            y: 0,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12)) drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
            transition: { y: { type: 'spring', stiffness: 500, damping: 25 }, filter: { duration: 0.1 } },
          },
        }}
        aria-label="Take placement test to jump to this unit"
      >
          {/* Static 3D base — stays in place while face moves */}
          <svg
            width={BTN_W}
            height={BTN_H}
            viewBox={`0 0 ${BTN_W} ${BTN_H}`}
            fill="none"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <rect x="4" y={DEPTH + 6} width="152" height="42" rx="21" fill={theme.dark} />
          </svg>

          {/* Animated button face — lifts on hover, presses into base on tap */}
          <motion.div
            style={{ position: 'relative' }}
            variants={{
              rest: { y: 0 },
              hover: { y: -2 },
              pressed: { y: DEPTH },
            }}
            transition={{ type: 'spring', stiffness: 600, damping: 20, mass: 0.6 }}
          >
            <svg
              width={BTN_W}
              height={BTN_H}
              viewBox={`0 0 ${BTN_W} ${BTN_H}`}
              fill="none"
            >
              {/* Main pill face */}
              <rect x="4" y="6" width="152" height="42" rx="21" fill={theme.color} />
              {/* Top highlight arc — gives convex curvature illusion */}
              <rect x="4" y="6" width="152" height="21" rx="21" fill="white" fillOpacity="0.2" />
              {/* Specular glow line */}
              <rect x="16" y="10" width="128" height="3" rx="1.5" fill="white" fillOpacity="0.3" />

              {/* Rocket icon */}
              <g transform="translate(28, 15)" fill="white">
                <path d="M10 0C10 0 6.5 3.5 6.5 8.5C6.5 11.5 8 14 10 16C12 14 13.5 11.5 13.5 8.5C13.5 3.5 10 0 10 0Z" fillOpacity="0.95" />
                <circle cx="10" cy="8.5" r="2.2" fill={theme.color} />
                <path d="M6.5 12L4 15L6.5 14.2" fillOpacity="0.85" />
                <path d="M13.5 12L16 15L13.5 14.2" fillOpacity="0.85" />
                <path d="M8 16L7 20H9L10 17.5L11 20H13L12 16" fillOpacity="0.7" />
              </g>

              {/* "Jump here" text */}
              <text
                x="95"
                y="30"
                textAnchor="middle"
                fill="white"
                fontFamily="inherit"
                fontWeight="800"
                fontSize="15"
                letterSpacing="0.3"
              >
                Jump here
              </text>
            </svg>
          </motion.div>
        </motion.button>
    </motion.div>
  );
}
