import type { Metadata } from 'next';
export { default } from './SkillsClient';

export const metadata: Metadata = {
  title: 'Interview Readiness',
  description: 'Track your interview readiness score on Octokeen. See your strengths, focus areas, and topic-by-topic mastery across all subjects.',
  openGraph: {
    title: 'Interview Readiness | Octokeen',
    description: 'Track your interview readiness score on Octokeen. See your strengths, focus areas, and topic-by-topic mastery across all subjects.',
    url: '/skills',
  },
  twitter: {
    card: 'summary',
    title: 'Interview Readiness | Octokeen',
    description: 'Track your interview readiness score on Octokeen. See your strengths, focus areas, and topic-by-topic mastery across all subjects.',
  },
};
