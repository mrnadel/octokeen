// ── Types ────────────────────────────────────────────────────

export type CountryCode = 'US' | 'GB' | 'AU' | 'CA' | 'IL' | 'EU' | 'INT';
export type ExperienceLevel = 0 | 1 | 2 | 3;
export type PlacementChoice = 'scratch' | 'test' | 'advanced';
export type GoalChoice = 'interview' | 'refresh' | 'exam' | 'curiosity';
export type CommitmentChoice = 5 | 10 | 15 | 20;

export interface CourseIntroData {
  experienceLevel: ExperienceLevel;
  placementChoice: PlacementChoice;
  goal: GoalChoice;
  dailyMinutes: CommitmentChoice;
  completedAt: string;
  placedDone?: boolean;
}

// ── Experience Level Options ──────────────────────────────────

export const EXPERIENCE_OPTIONS = [
  { level: 0 as const, bars: 1, label: "I'm completely new", sub: 'Never studied this' },
  { level: 1 as const, bars: 2, label: 'I know the basics', sub: 'Took a course or two' },
  { level: 2 as const, bars: 3, label: 'I use this at work', sub: 'Comfortable with core topics' },
  { level: 3 as const, bars: 4, label: 'I could teach it', sub: 'Deep expertise' },
];

// ── Goal Options ──────────────────────────────────────────────

export const GOAL_OPTIONS: { value: GoalChoice; icon: string; label: string }[] = [
  { value: 'interview', icon: '💼', label: 'Job interviews' },
  { value: 'refresh', icon: '🔄', label: 'Knowledge refresh' },
  { value: 'exam', icon: '📝', label: 'Exam preparation' },
  { value: 'curiosity', icon: '💡', label: 'Personal curiosity' },
];

// ── Commitment Options ────────────────────────────────────────

export const COMMITMENT_OPTIONS: { value: CommitmentChoice; label: string; tag: string; icon: string }[] = [
  { value: 5, label: '5 min', tag: 'Casual', icon: '🌱' },
  { value: 10, label: '10 min', tag: 'Regular', icon: '🔥' },
  { value: 15, label: '15 min', tag: 'Serious', icon: '⚡' },
  { value: 20, label: '20+ min', tag: 'Intense', icon: '🚀' },
];

// ── Country Options ───────────────────────────────────────────

export const COUNTRY_OPTIONS: { value: CountryCode; flag: string; label: string }[] = [
  { value: 'US', flag: '🇺🇸', label: 'United States' },
  { value: 'GB', flag: '🇬🇧', label: 'United Kingdom' },
  { value: 'AU', flag: '🇦🇺', label: 'Australia' },
  { value: 'CA', flag: '🇨🇦', label: 'Canada' },
  { value: 'IL', flag: '🇮🇱', label: 'Israel' },
  { value: 'EU', flag: '🇪🇺', label: 'Europe' },
  { value: 'INT', flag: '🌍', label: 'Other' },
];
