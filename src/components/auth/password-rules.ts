import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';

export interface PasswordCheck {
  label: string;
  met: boolean;
}

/**
 * Single source of truth for the password policy shown in the strength meter
 * and enforced by the register / reset-password submit buttons.
 */
export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    { label: `${PASSWORD_MIN_LENGTH}+ chars`, met: password.length >= PASSWORD_MIN_LENGTH },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special char', met: /[^A-Za-z0-9]/.test(password) },
  ];
}

/** True when the password satisfies every rule in {@link getPasswordChecks}. */
export function isStrongPassword(password: string): boolean {
  return getPasswordChecks(password).every((check) => check.met);
}
