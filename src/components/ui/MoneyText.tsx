import type { ReactNode } from 'react';

export function MoneyText({ text }: { text: string }): ReactNode {
  if (!text) return null;
  return <>{text}</>;
}
