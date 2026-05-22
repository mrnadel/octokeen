import type { Metadata } from 'next';
export { default } from './AchievementsClient';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'View all your Octokeen achievements. Unlock badges and earn XP by mastering topics, maintaining streaks, and completing challenges.',
  openGraph: {
    title: 'Achievements | Octokeen',
    description: 'View all your Octokeen achievements. Unlock badges and earn XP by mastering topics, maintaining streaks, and completing challenges.',
    url: '/achievements',
  },
  twitter: {
    card: 'summary',
    title: 'Achievements | Octokeen',
    description: 'View all your Octokeen achievements. Unlock badges and earn XP by mastering topics, maintaining streaks, and completing challenges.',
  },
};
