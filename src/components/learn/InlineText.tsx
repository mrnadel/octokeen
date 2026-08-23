import { Fragment, type ReactNode } from 'react';

/** Splits on `**bold**`, keeping the delimiters so the odd segments are the bold ones. */
const BOLD_SPLIT = /\*\*(.+?)\*\*/g;

/**
 * Renders guide copy with the one piece of inline markup the authoring format
 * allows: `**bold**`. Everything else is emitted as text, so guide data can
 * never introduce markup, and no `dangerouslySetInnerHTML` is involved.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  const segments = text.split(BOLD_SPLIT);
  return segments.map((segment, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-extrabold text-surface-900 dark:text-surface-100">
        {segment}
      </strong>
    ) : (
      <Fragment key={index}>{segment}</Fragment>
    )
  );
}
