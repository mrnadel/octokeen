/** Shared Tailwind class strings for the stacked settings rows. */
export const SETTINGS_ROW = {
  /** Base layout for every row in a settings card. */
  base: 'flex items-center w-full px-4 py-3 transition-colors',
  /** Hover treatment for rows that navigate or toggle. */
  hover: 'hover:bg-gray-50 dark:hover:bg-surface-700',
  /** Top border separating a row from the one above it. */
  divider: 'border-t border-gray-100 dark:border-surface-700',
  /** Trailing chevron icon. */
  chevron: 'w-4 h-4 text-gray-300 dark:text-surface-600 shrink-0 ml-1',
} as const;

/** Row that navigates elsewhere — base layout plus hover. */
export const SETTINGS_ROW_LINK = `${SETTINGS_ROW.base} ${SETTINGS_ROW.hover}`;

/** Primary text inside a settings row. */
export const SETTINGS_ROW_LABEL = 'text-sm font-semibold text-gray-800 dark:text-surface-100 flex-1 text-left';
