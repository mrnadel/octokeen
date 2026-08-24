import { buildPrivateMetadata } from '@/lib/seo/metadata';

export { default } from './RegisterClient';

export const metadata = buildPrivateMetadata({
  title: 'Create Account',
  path: '/register',
  description: 'Create your free Octokeen account and start your gamified learning journey today.',
});
