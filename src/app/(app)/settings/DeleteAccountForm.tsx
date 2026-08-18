'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { DangerZoneAction } from './DangerZoneAction';
import { SETTINGS_ROW } from './settingsRowStyles';

const CONFIRM_PHRASE = 'DELETE MY ACCOUNT';

interface DeleteAccountFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function DeleteAccountForm({ onSuccess, onError }: DeleteAccountFormProps) {
  const handleDelete = useCallback(async (): Promise<void> => {
    const res = await fetch('/api/user/delete-account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: CONFIRM_PHRASE }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete account');
    }
    localStorage.clear();
    onSuccess?.();
    await signOut({ callbackUrl: '/login' });
  }, [onSuccess]);

  return (
    <DangerZoneAction
      label="Delete account"
      labelClass="text-red-500"
      rowClass={`${SETTINGS_ROW.divider} !border-red-100 dark:!border-red-900/40`}
      warningTitle="This will permanently delete your account."
      warningBody="Your credentials, progress, subscription, and friend connections will be erased."
      confirmPhrase={CONFIRM_PHRASE}
      confirmLabel="Permanently Delete Account"
      confirmButtonClass="bg-red-600 hover:bg-red-700"
      onConfirm={handleDelete}
      onError={onError}
    />
  );
}
