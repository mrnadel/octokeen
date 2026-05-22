import type { Metadata } from 'next';
export { default } from './LeagueClient';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Compete in weekly leagues on Octokeen. Earn XP, climb the leaderboard, and win gem rewards for finishing at the top of your tier.',
  openGraph: {
    title: 'Leaderboard | Octokeen',
    description: 'Compete in weekly leagues on Octokeen. Earn XP, climb the leaderboard, and win gem rewards for finishing at the top of your tier.',
    url: '/league',
  },
  twitter: {
    card: 'summary',
    title: 'Leaderboard | Octokeen',
    description: 'Compete in weekly leagues on Octokeen. Earn XP, climb the leaderboard, and win gem rewards for finishing at the top of your tier.',
  },
};
