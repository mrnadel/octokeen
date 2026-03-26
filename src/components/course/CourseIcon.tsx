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
        {/* Back bill */}
        <rect x="1" y="6.5" width="16" height="11" rx="2" fill="#2D8C4E" />
        <rect x="1.8" y="7.3" width="14.4" height="9.4" rx="1.2" fill="#3BA55D" />
        <circle cx="9" cy="12" r="2.5" fill="#2D8C4E" opacity="0.5" />
        {/* Front bill */}
        <rect x="2.5" y="8.5" width="16" height="11" rx="2" fill="#34A853" />
        <rect x="3.3" y="9.3" width="14.4" height="9.4" rx="1.2" fill="#43C46E" />
        <circle cx="10.5" cy="14" r="2.5" fill="#34A853" opacity="0.5" />
        {/* Bill decorative corners */}
        <rect x="4.2" y="10.2" width="2" height="1.2" rx="0.6" fill="#34A853" opacity="0.6" />
        <rect x="14.8" y="17.6" width="2" height="1.2" rx="0.6" fill="#34A853" opacity="0.6" />
        {/* Gold coin */}
        <circle cx="18" cy="15.5" r="5.5" fill="#E5A100" />
        <circle cx="18" cy="15.5" r="4.3" fill="#FFC107" />
        <circle cx="18" cy="15.5" r="3.6" fill="#FFD54F" />
        {/* Dollar sign on coin */}
        <text x="18" y="17.8" textAnchor="middle" fill="#E5A100" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="6">$</text>
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
