'use client';

import { memo } from 'react';
import { useLessonColors } from '@/lib/lessonColors';

/** Memoised diagram so SVG animations don't reset on answer selection re-renders */
const DiagramDisplay = memo(function DiagramDisplay({ html }: { html: string }) {
  const c = useLessonColors();
  const sanitised = html
    .replace(/(<svg[^>]*)\sheight="auto"/gi, '$1')
    .replace(/(<svg[^>]*)\swidth="auto"/gi, '$1');

  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden"
      style={{
        borderRadius: 14,
        background: c.cardBg,
        border: `2px solid ${c.border}`,
        padding: 10,
        maxWidth: 400,
        margin: '0 auto',
      }}
      dangerouslySetInnerHTML={{ __html: sanitised }}
    />
  );
});

export default DiagramDisplay;
