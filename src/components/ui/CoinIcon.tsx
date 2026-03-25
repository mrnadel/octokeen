export function CoinIcon({ size = '1em' }: { size?: string } = {}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      style={{
        display: 'inline-block',
        verticalAlign: '-0.15em',
        marginLeft: 2,
        flexShrink: 0,
      }}
    >
      {/* 3D edge */}
      <circle cx="10" cy="10.8" r="8.5" fill="#B8860B" />
      {/* Coin face */}
      <circle cx="10" cy="10" r="8.5" fill="#FFD700" />
      {/* Inner ring */}
      <circle cx="10" cy="10" r="6" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.3" />
      {/* Shine arc */}
      <path
        d="M6 7 Q10 3 14 7"
        fill="none"
        stroke="#FFF1AA"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
