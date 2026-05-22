export function SignalBars({ count, color }: { count: number; color: string }) {
  const heights = [6, 10, 14, 18];
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" className="flex-shrink-0">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={1 + i * 6}
          y={20 - h}
          width={4}
          rx={1.5}
          height={h}
          fill={i < count ? color : '#E2E8F0'}
        />
      ))}
    </svg>
  );
}
