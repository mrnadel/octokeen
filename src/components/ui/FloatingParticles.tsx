'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

type Intensity = 'subtle' | 'normal' | 'celebration';

interface FloatingParticlesProps {
  /** CSS color string, e.g. "rgba(255,255,255,0.25)" */
  color: string;
  count?: number;
  /** drift = gentle wander, rise = float upward */
  drift?: boolean;
  /** subtle = few small dots, normal = default, celebration = lots of big bright particles */
  intensity?: Intensity;
}

const presets: Record<Intensity, { count: number; sizeBase: number; sizeRange: number; peakOpacity: number; peakScale: number }> = {
  subtle:      { count: 4,  sizeBase: 3, sizeRange: 2, peakOpacity: 0.4, peakScale: 0.7 },
  normal:      { count: 6,  sizeBase: 5, sizeRange: 3, peakOpacity: 0.6, peakScale: 1.0 },
  celebration: { count: 12, sizeBase: 6, sizeRange: 5, peakOpacity: 0.7, peakScale: 1.2 },
};

export function FloatingParticles({ color, count, drift, intensity = 'normal' }: FloatingParticlesProps) {
  const preset = presets[intensity];
  const total = count ?? preset.count;

  const particles = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        id: i,
        x: ((i * 37 + 13) % 90) + 5,
        y: drift ? ((i * 29 + 11) % 80) + 5 : (i * 23 + 7) % 20,
        size: preset.sizeBase + (i % 4) * (preset.sizeRange / 3),
        delay: (i * 1.3) % 6,
        dur: 5 + (i % 5) * 1.2,
        dx: ((i * 23 + 5) % 60) - 30,
      })),
    [total, drift, preset],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) =>
        drift ? (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, background: color, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              x: [0, p.dx, p.dx * 1.5],
              y: [0, -50, -120],
              opacity: [0, preset.peakOpacity, 0],
              scale: [0.4, preset.peakScale * 0.7, 0.3],
            }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, background: color, left: `${p.x}%`, bottom: `${p.y}%` }}
            animate={{
              y: [0, -300, -650],
              opacity: [0, preset.peakOpacity, 0],
              scale: [0.5, preset.peakScale, 0.5],
            }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ),
      )}
    </div>
  );
}
