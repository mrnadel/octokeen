import { buildPrivateMetadata } from '@/lib/seo/metadata';

export { default } from './ResetPasswordClient';

export const metadata = buildPrivateMetadata({
  title: 'Set New Password',
  path: '/reset-password',
  description: 'Set a new password for your Octokeen account.',
});
