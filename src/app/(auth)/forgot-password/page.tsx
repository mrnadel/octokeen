import { buildPrivateMetadata } from '@/lib/seo/metadata';

export { default } from './ForgotPasswordClient';

export const metadata = buildPrivateMetadata({
  title: 'Reset Password',
  path: '/forgot-password',
  description: 'Reset your Octokeen account password.',
});
