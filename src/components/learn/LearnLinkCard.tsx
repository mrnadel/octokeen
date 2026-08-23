import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface LearnLinkCardProps {
  href: string;
  title: string;
  description: string;
  /** Short qualifier shown above the title, e.g. "8 min read" or "18 units". */
  meta?: string;
}

/** Link card used for both course entries and guide entries under `/learn`. */
export function LearnLinkCard({ href, title, description, meta }: LearnLinkCardProps) {
  return (
    <li>
      <Link
        href={href}
        className="group block rounded-2xl border-2 border-surface-200 bg-white p-4 transition-colors hover:border-primary-400 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-600"
      >
        {meta ? (
          <p className="text-xs font-extrabold uppercase tracking-wide text-surface-400">{meta}</p>
        ) : null}
        <p className="mt-1 flex items-start gap-1.5 text-base font-extrabold text-surface-900 dark:text-surface-50">
          <span>{title}</span>
          <ArrowRight
            className="mt-1 h-4 w-4 shrink-0 text-primary-500 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </p>
        <p className="mt-1.5 text-sm leading-6 text-surface-600 dark:text-surface-300">
          {description}
        </p>
      </Link>
    </li>
  );
}
