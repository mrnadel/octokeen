import type { Level } from './types';

export const levels: Level[] = [
  { level: 1,  title: 'Apprentice',                xpRequired: 0,      icon: '🔩', badge: '/badges/level-1.png' },
  { level: 2,  title: 'Shop Hand',                  xpRequired: 100,    icon: '🔧', badge: '/badges/level-2.png' },
  { level: 3,  title: 'Drafter',                     xpRequired: 250,    icon: '📏', badge: '/badges/level-3.png' },
  { level: 4,  title: 'Junior Technician',           xpRequired: 500,    icon: '🛠️', badge: '/badges/level-4.png' },
  { level: 5,  title: 'Lab Assistant',               xpRequired: 850,    icon: '🔬', badge: '/badges/level-5.png' },
  { level: 6,  title: 'Design Intern',               xpRequired: 1300,   icon: '📐', badge: '/badges/level-6.png' },
  { level: 7,  title: 'Associate Engineer',          xpRequired: 1900,   icon: '⚙️', badge: '/badges/level-7.png' },
  { level: 8,  title: 'Project Engineer',            xpRequired: 2600,   icon: '🏗️', badge: '/badges/level-8.png' },
  { level: 9,  title: 'Stress Analyst',              xpRequired: 3500,   icon: '📊', badge: '/badges/level-9.png' },
  { level: 10, title: 'Thermal Specialist',          xpRequired: 4500,   icon: '🌡️', badge: '/badges/level-10.png' },
  { level: 11, title: 'Design Lead',                 xpRequired: 5700,   icon: '✏️', badge: '/badges/level-11.png' },
  { level: 12, title: 'Manufacturing Engineer',      xpRequired: 7100,   icon: '🏭', badge: '/badges/level-12.png' },
  { level: 13, title: 'Reliability Engineer',        xpRequired: 8700,   icon: '🔗', badge: '/badges/level-13.png' },
  { level: 14, title: 'Systems Engineer',            xpRequired: 10500,  icon: '🌐', badge: '/badges/level-14.png' },
  { level: 15, title: 'Senior Engineer',             xpRequired: 12500,  icon: '🎖️', badge: '/badges/level-15.png' },
  { level: 16, title: 'Materials Specialist',        xpRequired: 14800,  icon: '💎', badge: '/badges/level-16.png' },
  { level: 17, title: 'Technical Lead',              xpRequired: 17400,  icon: '🗂️', badge: '/badges/level-17.png' },
  { level: 18, title: 'Principal Engineer',          xpRequired: 20300,  icon: '🏛️', badge: '/badges/level-18.png' },
  { level: 19, title: 'R&D Innovator',              xpRequired: 23500,  icon: '💡', badge: '/badges/level-19.png' },
  { level: 20, title: 'Engineering Manager',         xpRequired: 27000,  icon: '📋', badge: '/badges/level-20.png' },
  { level: 21, title: 'Staff Engineer',              xpRequired: 31000,  icon: '⭐', badge: '/badges/level-21.png' },
  { level: 22, title: 'Domain Expert',               xpRequired: 35500,  icon: '🧠', badge: '/badges/level-22.png' },
  { level: 23, title: 'Distinguished Engineer',      xpRequired: 40500,  icon: '🏆', badge: '/badges/level-23.png' },
  { level: 24, title: 'Chief Engineer',              xpRequired: 46000,  icon: '👔', badge: '/badges/level-24.png' },
  { level: 25, title: 'Engineering Fellow',          xpRequired: 52000,  icon: '🎓', badge: '/badges/level-25.png' },
  { level: 26, title: 'Technical Director',          xpRequired: 59000,  icon: '🗝️', badge: '/badges/level-26.png' },
  { level: 27, title: 'VP of Engineering',           xpRequired: 67000,  icon: '🏢', badge: '/badges/level-27.png' },
  { level: 28, title: 'CTO',                        xpRequired: 76000,  icon: '💼', badge: '/badges/level-28.png' },
  { level: 29, title: 'Engineering Legend',          xpRequired: 86000,  icon: '🌟', badge: '/badges/level-29.png' },
  { level: 30, title: 'Mechanical Grandmaster',      xpRequired: 100000, icon: '👑', badge: '/badges/level-30.png' },
];

// --------------- Helper functions ---------------

export function getLevelForXp(totalXp: number): Level {
  let current = levels[0];
  for (const level of levels) {
    if (totalXp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXpToNextLevel(totalXp: number): {
  current: Level;
  next: Level | null;
  xpNeeded: number;
  progress: number;
} {
  const current = getLevelForXp(totalXp);
  const nextIndex = levels.findIndex((l) => l.level === current.level) + 1;
  const next = nextIndex < levels.length ? levels[nextIndex] : null;

  if (!next) {
    return { current, next: null, xpNeeded: 0, progress: 1 };
  }

  const xpIntoCurrentLevel = totalXp - current.xpRequired;
  const xpForCurrentLevel = next.xpRequired - current.xpRequired;
  const progress = xpIntoCurrentLevel / xpForCurrentLevel;

  return {
    current,
    next,
    xpNeeded: next.xpRequired - totalXp,
    progress: Math.min(progress, 1),
  };
}
