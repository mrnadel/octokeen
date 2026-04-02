import Image from 'next/image';
import { PROFESSION_ID } from '@/data/professions';

const COURSE_ICONS: Record<string, string> = {
  [PROFESSION_ID.MECHANICAL_ENGINEERING]: '/badges/course-mechanical-engineering.png',
  [PROFESSION_ID.PERSONAL_FINANCE]: '/badges/course-personal-finance.png',
  [PROFESSION_ID.PSYCHOLOGY]: '/badges/course-psychology.png',
  [PROFESSION_ID.SPACE_ASTRONOMY]: '/badges/course-space-astronomy.png',
};

interface CourseIconProps {
  professionId: string;
  color: string;
  size?: number;
}

export function CourseIcon({ professionId, color, size = 22 }: CourseIconProps) {
  const src = COURSE_ICONS[professionId];

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        draggable={false}
      />
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
