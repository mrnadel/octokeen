import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { BreadcrumbItem } from '@/lib/seo/structured-data';

/**
 * Visible breadcrumb trail. Takes the same `BreadcrumbItem[]` handed to
 * `buildBreadcrumbJsonLd`, so the markup and the structured data are built
 * from one list and cannot describe different hierarchies.
 */
export function LearnBreadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs font-semibold text-surface-500">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-1">
            {index > 0 ? <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" /> : null}
            {index === lastIndex ? (
              <span aria-current="page" className="text-surface-400">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-primary-600">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
