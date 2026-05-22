import type { QuestRarity } from '@/data/engagement-types';

export interface RarityTheme {
  label: string;
  // Icon container
  iconBg: string;
  iconBgDark: string;
  // Card surface
  cardBg: string;
  cardBgDark: string;
  cardBorder: string;
  cardBorderDark: string;
  // 3D shadow under card
  shadow: string;
  shadowDark: string;
  // Text
  titleColor: string;
  titleColorDark: string;
  descColor: string;
  descColorDark: string;
  counterColor: string;
  counterColorDark: string;
  // Badge
  badgeBg: string;
  badgeBgDark: string;
  badgeBorder: string;
  badgeBorderDark: string;
  badgeText: string;
  badgeTextDark: string;
  // Progress bar
  barTrack: string;
  barTrackDark: string;
  barFill: string;
  // Rewards
  gemColor: string;
  gemColorDark: string;
  xpColor: string;
  xpColorDark: string;
  // Compact mode (home widget)
  compactIconBg: string;
  compactIconBgDark: string;
  compactBadgeBg: string;
  compactBadgeBgDark: string;
  compactBadgeText: string;
}

export const RARITY: Record<QuestRarity, RarityTheme> = {
  common: {
    label: 'Common',
    iconBg: '#E2E8F0',
    iconBgDark: 'rgba(100,116,139,0.2)',
    cardBg: '#FFFFFF',
    cardBgDark: 'rgba(30,41,59,0.85)',
    cardBorder: '1.5px solid rgba(203,213,225,0.7)',
    cardBorderDark: '1.5px solid rgba(71,85,105,0.4)',
    shadow: 'rgba(148,163,184,0.35)',
    shadowDark: 'rgba(0,0,0,0.35)',
    titleColor: '#1E293B',
    titleColorDark: '#F1F5F9',
    descColor: '#64748B',
    descColorDark: '#94A3B8',
    counterColor: '#64748B',
    counterColorDark: '#94A3B8',
    badgeBg: '#F1F5F9',
    badgeBgDark: 'rgba(100,116,139,0.25)',
    badgeBorder: 'rgba(203,213,225,0.8)',
    badgeBorderDark: 'rgba(100,116,139,0.3)',
    badgeText: '#64748B',
    badgeTextDark: '#94A3B8',
    barTrack: 'rgba(203,213,225,0.6)',
    barTrackDark: 'rgba(71,85,105,0.5)',
    barFill: 'linear-gradient(90deg, #94A3B8, #64748B)',
    gemColor: '#059669',
    gemColorDark: '#34D399',
    xpColor: '#D97706',
    xpColorDark: '#FBBF24',
    compactIconBg: '#F1F5F9',
    compactIconBgDark: 'rgba(148,163,184,0.15)',
    compactBadgeBg: '#F1F5F9',
    compactBadgeBgDark: 'rgba(148,163,184,0.2)',
    compactBadgeText: '#64748B',
  },
  rare: {
    label: 'Rare',
    iconBg: '#93C5FD',
    iconBgDark: 'rgba(59,130,246,0.3)',
    cardBg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    cardBgDark: 'linear-gradient(135deg, rgba(23,37,84,0.6) 0%, rgba(30,58,138,0.5) 100%)',
    cardBorder: '1.5px solid rgba(147,197,253,0.7)',
    cardBorderDark: '1.5px solid rgba(59,130,246,0.35)',
    shadow: 'rgba(59,130,246,0.3)',
    shadowDark: 'rgba(29,78,216,0.35)',
    titleColor: '#1E3A5F',
    titleColorDark: '#BFDBFE',
    descColor: '#3B6EA5',
    descColorDark: '#93C5FD',
    counterColor: '#2563EB',
    counterColorDark: '#60A5FA',
    badgeBg: 'rgba(191,219,254,0.6)',
    badgeBgDark: 'rgba(59,130,246,0.2)',
    badgeBorder: 'rgba(147,197,253,0.8)',
    badgeBorderDark: 'rgba(96,165,250,0.3)',
    badgeText: '#2563EB',
    badgeTextDark: '#60A5FA',
    barTrack: 'rgba(191,219,254,0.6)',
    barTrackDark: 'rgba(30,58,138,0.5)',
    barFill: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
    gemColor: '#059669',
    gemColorDark: '#34D399',
    xpColor: '#2563EB',
    xpColorDark: '#60A5FA',
    compactIconBg: '#DBEAFE',
    compactIconBgDark: 'rgba(59,130,246,0.15)',
    compactBadgeBg: '#DBEAFE',
    compactBadgeBgDark: 'rgba(59,130,246,0.2)',
    compactBadgeText: '#2563EB',
  },
  epic: {
    label: 'Epic',
    iconBg: 'rgba(109,40,217,0.35)',
    iconBgDark: 'rgba(139,92,246,0.3)',
    cardBg: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #8B5CF6 100%)',
    cardBgDark: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 40%, #6D28D9 100%)',
    cardBorder: '2px solid rgba(167,139,250,0.5)',
    cardBorderDark: '2px solid rgba(139,92,246,0.5)',
    shadow: 'rgba(91,33,182,0.45)',
    shadowDark: 'rgba(76,29,149,0.5)',
    titleColor: '#FFFFFF',
    titleColorDark: '#FFFFFF',
    descColor: 'rgba(237,233,254,0.85)',
    descColorDark: 'rgba(221,214,254,0.8)',
    counterColor: 'rgba(255,255,255,0.9)',
    counterColorDark: 'rgba(255,255,255,0.85)',
    badgeBg: 'rgba(91,33,182,0.5)',
    badgeBgDark: 'rgba(76,29,149,0.5)',
    badgeBorder: 'rgba(167,139,250,0.4)',
    badgeBorderDark: 'rgba(139,92,246,0.4)',
    badgeText: '#EDE9FE',
    badgeTextDark: '#DDD6FE',
    barTrack: 'rgba(91,33,182,0.4)',
    barTrackDark: 'rgba(76,29,149,0.5)',
    barFill: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
    gemColor: '#FFFFFF',
    gemColorDark: '#FFFFFF',
    xpColor: '#DDD6FE',
    xpColorDark: '#C4B5FD',
    compactIconBg: '#EDE9FE',
    compactIconBgDark: 'rgba(139,92,246,0.15)',
    compactBadgeBg: '#EDE9FE',
    compactBadgeBgDark: 'rgba(139,92,246,0.2)',
    compactBadgeText: '#7C3AED',
  },
  legendary: {
    label: 'Legendary',
    iconBg: 'rgba(180,83,9,0.3)',
    iconBgDark: 'rgba(245,158,11,0.3)',
    cardBg: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 40%, #FBBF24 100%)',
    cardBgDark: 'linear-gradient(135deg, #92400E 0%, #A16207 40%, #B45309 100%)',
    cardBorder: '2.5px solid rgba(251,191,36,0.7)',
    cardBorderDark: '2.5px solid rgba(245,158,11,0.6)',
    shadow: 'rgba(180,83,9,0.45)',
    shadowDark: 'rgba(120,53,15,0.5)',
    titleColor: '#451A03',
    titleColorDark: '#FFFFFF',
    descColor: '#78350F',
    descColorDark: 'rgba(254,243,199,0.85)',
    counterColor: '#78350F',
    counterColorDark: 'rgba(255,255,255,0.9)',
    badgeBg: 'rgba(180,83,9,0.35)',
    badgeBgDark: 'rgba(180,83,9,0.5)',
    badgeBorder: 'rgba(217,119,6,0.5)',
    badgeBorderDark: 'rgba(245,158,11,0.5)',
    badgeText: '#FEF3C7',
    badgeTextDark: '#FEF3C7',
    barTrack: 'rgba(180,83,9,0.25)',
    barTrackDark: 'rgba(120,53,15,0.5)',
    barFill: 'linear-gradient(90deg, #FEF3C7, #FDE68A)',
    gemColor: '#451A03',
    gemColorDark: '#FFFFFF',
    xpColor: '#78350F',
    xpColorDark: '#FEF3C7',
    compactIconBg: '#FEF3C7',
    compactIconBgDark: 'rgba(245,158,11,0.15)',
    compactBadgeBg: '#FEF3C7',
    compactBadgeBgDark: 'rgba(245,158,11,0.2)',
    compactBadgeText: '#D97706',
  },
};
