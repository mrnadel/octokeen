import type { Metadata } from 'next';
export { default } from './GlossaryClient';

export const metadata: Metadata = {
  title: 'Glossary',
  description: 'Browse the Octokeen glossary for clear, concise definitions of every financial and professional term covered in our courses.',
  openGraph: {
    title: 'Glossary | Octokeen',
    description: 'Browse the Octokeen glossary for clear, concise definitions of every financial and professional term covered in our courses.',
    url: '/glossary',
  },
  twitter: {
    card: 'summary',
    title: 'Glossary | Octokeen',
    description: 'Browse the Octokeen glossary for clear, concise definitions of every financial and professional term covered in our courses.',
  },
};
