'use client';

import { cn } from '@/lib/utils';
import { getPasswordChecks } from '@/components/auth/password-rules';

/** Bars drawn by this variant. The score runs 0..rules, so it is not the rule count. */
const BARS = [1, 2, 3];
/** One below the full score — the last step before every rule is satisfied. */
const NEARLY_THERE_OFFSET = 1;

export function PasswordStrength({ password }: { password: string }) {
  const checks = getPasswordChecks(password);
  if (!password) return null;

  const score = checks.filter((c) => c.met).length;
  const fillClass =
    score === checks.length
      ? 'bg-primary-500'
      : score === checks.length - NEARLY_THERE_OFFSET
        ? 'bg-primary-400'
        : 'bg-red-400';

  return (
    <div className="space-y-2 pt-1">
      <div className="flex gap-1">
        {BARS.map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 sm:h-1 flex-1 rounded-full transition-colors',
              i <= score ? fillClass : 'bg-surface-200 dark:bg-surface-700',
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {checks.map((check) => (
          <span
            key={check.label}
            className={cn('text-xs font-bold', check.met ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500')}
          >
            {check.met ? '✓' : '•'} {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}
