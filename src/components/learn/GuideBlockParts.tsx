import { Lightbulb, ListChecks, TriangleAlert } from 'lucide-react';

import type { GuideCalloutTone } from '@/data/learn/types';

import { InlineText } from './InlineText';

const CALLOUT_TONES = {
  insight: {
    icon: Lightbulb,
    frame: 'border-primary-300 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/25',
    mark: 'text-primary-700 dark:text-primary-300',
  },
  warning: {
    icon: TriangleAlert,
    frame: 'border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/25',
    mark: 'text-brand-700 dark:text-brand-300',
  },
  example: {
    icon: ListChecks,
    frame: 'border-accent-300 bg-accent-50 dark:border-accent-800 dark:bg-accent-900/25',
    mark: 'text-accent-700 dark:text-accent-300',
  },
} as const;

export interface GuideCalloutProps {
  tone: GuideCalloutTone;
  title: string;
  text: string;
}

export function GuideCallout({ tone, title, text }: GuideCalloutProps) {
  const { icon: Icon, frame, mark } = CALLOUT_TONES[tone];
  return (
    <aside className={`my-6 rounded-2xl border-2 p-4 sm:p-5 ${frame}`}>
      <p className={`flex items-center gap-2 text-sm font-extrabold ${mark}`}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-2 text-[0.9375rem] leading-7 text-surface-700 dark:text-surface-300">
        <InlineText text={text} />
      </p>
    </aside>
  );
}

export interface GuideTableProps {
  columns: string[];
  rows: string[][];
  caption?: string;
}

/**
 * Tables are the densest thing a guide renders and phones are the majority of
 * the traffic, so the table scrolls inside its own container rather than
 * forcing the page to scroll sideways.
 */
export function GuideTable({ columns, rows, caption }: GuideTableProps) {
  return (
    <div className="my-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="mb-2 text-left text-xs font-semibold text-surface-500">{caption}</caption>
        ) : null}
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column}
                scope="col"
                className="border-b-2 border-surface-200 pb-2 pr-4 align-bottom font-extrabold text-surface-800 dark:border-surface-700 dark:text-surface-100"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row[0] ?? rowIndex} className="align-top">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cellIndex}`}
                  className="border-b border-surface-200 py-3 pr-4 leading-6 text-surface-600 dark:border-surface-800 dark:text-surface-300"
                >
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface GuideStepsProps {
  items: { title: string; text: string }[];
}

export function GuideSteps({ items }: GuideStepsProps) {
  return (
    <ol className="my-6 space-y-4">
      {items.map((item, index) => (
        <li key={item.title} className="flex gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-extrabold text-white">
            {index + 1}
          </span>
          <div>
            <p className="text-[0.9375rem] font-extrabold text-surface-900 dark:text-surface-100">
              {item.title}
            </p>
            <p className="mt-1 text-[0.9375rem] leading-7 text-surface-600 dark:text-surface-300">
              <InlineText text={item.text} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
