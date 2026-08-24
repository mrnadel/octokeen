import { buildPrivateMetadata } from '@/lib/seo/metadata';
export { default } from './AdminIndexClient';

export const metadata = buildPrivateMetadata({ title: 'Admin', path: '/admin' });
