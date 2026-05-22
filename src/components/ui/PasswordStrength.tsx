'use client';

import { cn } from '@/lib/utils';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: `${PASSWORD_MIN_LENGTH}+ chars`, met: password.length >= PASSWORD_MIN_LENGTH },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
  ];
  if (!password) return null;
  const score = checks.filter((c) => c.met).length;
  return (
    <div className="space-y-2 pt-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 sm:h-1 flex-1 rounded-full transition-colors',
              i <= score
                ? score === 3 ? 'bg-primary-500' : score === 2 ? 'bg-primary-400' : 'bg-red-400'
                : 'bg-surface-200 dark:bg-surface-700'
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {checks.map((check) => (
          <span key={check.label} className={cn('text-xs font-bold', check.met ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500')}>
            {check.met ? '✓' : '•'} {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}
