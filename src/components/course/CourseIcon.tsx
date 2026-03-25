interface CourseIconProps {
  professionId: string;
  color: string;
  size?: number;
}

export function CourseIcon({ professionId, color, size = 22 }: CourseIconProps) {
  if (professionId === 'mechanical-engineering') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (professionId === 'personal-finance') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bag body */}
        <path d="M5 13c0-4 2.5-6 7-6s7 2 7 6c0 4.5-2.5 8-7 8s-7-3.5-7-8Z" fill="#D97706" stroke="#78350F" strokeWidth="1.3" strokeLinejoin="round" />
        {/* Bag neck tie */}
        <path d="M9 7c-1-2-.5-3.5.8-5h4.4c1.3 1.5 1.8 3 .8 5" fill="#EA580C" stroke="#78350F" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Gold band */}
        <rect x="8.5" y="6.5" width="7" height="1.8" rx="0.9" fill="#FBBF24" stroke="#78350F" strokeWidth="0.7" />
        {/* Dollar sign on bag */}
        <text x="12" y="16.5" textAnchor="middle" fill="#FEF3C7" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="7">$</text>
        {/* Plant stem */}
        <line x1="12" y1="7" x2="12" y2="2.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
        {/* Left leaf */}
        <ellipse cx="9.5" cy="4.5" rx="2.5" ry="1.3" transform="rotate(-35 9.5 4.5)" fill="#22C55E" stroke="#065F46" strokeWidth="0.8" />
        {/* Right leaf */}
        <ellipse cx="14.5" cy="3.2" rx="2.5" ry="1.3" transform="rotate(35 14.5 3.2)" fill="#16A34A" stroke="#065F46" strokeWidth="0.8" />
        {/* Coin on top */}
        <circle cx="12" cy="1.8" r="1.8" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
        <text x="12" y="2.8" textAnchor="middle" fill="#78350F" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="2.4">$</text>
      </svg>
    );
  }

  // Fallback: colored circle with first letter
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-black"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.5 }}
    >
      {professionId.charAt(0).toUpperCase()}
    </div>
  );
}
