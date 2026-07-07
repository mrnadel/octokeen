import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: `${PASSWORD_MIN_LENGTH}+ chars`, met: password.length >= PASSWORD_MIN_LENGTH },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special char', met: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  const score = checks.filter((c) => c.met).length;

  return (
    <div className="space-y-2 pt-1" role="status" aria-label={`Password strength: ${score} of 4 requirements met`}>
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 sm:h-1 flex-1 rounded-full transition-colors ${
              i <= score
                ? score >= 4
                  ? 'bg-primary-500'
                  : score === 3
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                : 'bg-surface-200'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {checks.map((check) => (
          <span
            key={check.label}
            className={`text-xs font-bold ${check.met ? 'text-brand-400' : 'text-surface-300'}`}
          >
            {check.met ? '✓' : '•'} {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}
