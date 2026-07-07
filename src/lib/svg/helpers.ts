// SVG diagram helpers: reusable patterns extracted from bodies/defs

/** Specular highlight ellipse (white reflection on a sphere surface) */
export function specularHighlight(
  cx: number,
  cy: number,
  r: number,
  opts?: { dx?: number; dy?: number; rx?: number; ry?: number; opacity?: number }
): string {
  const dx = opts?.dx ?? -0.2;
  const dy = opts?.dy ?? -0.2;
  const rx = opts?.rx ?? 0.35;
  const ry = opts?.ry ?? 0.25;
  const opacity = opts?.opacity ?? 0.08;
  return `<ellipse cx="${cx + r * dx}" cy="${cy + r * dy}" rx="${r * rx}" ry="${r * ry}" fill="white" opacity="${opacity}"/>`;
}

interface GradientStop {
  offset: string;
  color: string;
  opacity: number;
}

/** Radial gradient with centered 50%/50%/50% layout and arbitrary stops */
export function radialGradient(id: string, stops: GradientStop[]): string {
  const stopEls = stops
    .map(
      (s) =>
        `<stop offset="${s.offset}" stop-color="${s.color}" stop-opacity="${s.opacity}"/>`
    )
    .join('');
  return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stopEls}</radialGradient>`;
}
