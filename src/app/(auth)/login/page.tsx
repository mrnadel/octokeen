import { buildPrivateMetadata } from '@/lib/seo/metadata';

export { default } from './LoginClient';

export const metadata = buildPrivateMetadata({
  title: 'Log In',
  path: '/login',
  description: 'Sign in to your Octokeen account to continue your learning journey.',
});
