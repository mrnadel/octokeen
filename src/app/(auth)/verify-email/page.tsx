import { buildPrivateMetadata } from '@/lib/seo/metadata';

export { default } from './VerifyEmailClient';

export const metadata = buildPrivateMetadata({
  title: 'Verify Email',
  path: '/verify-email',
  description: 'Verify your Octokeen email address.',
});
