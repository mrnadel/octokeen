'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    redirected.current = true;
    router.replace('/admin/feedback');
  }, [router]);

  return <p style={{ padding: 40, fontFamily: 'system-ui' }}>Redirecting...</p>;
}
