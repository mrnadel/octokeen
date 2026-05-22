'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { PASSWORD_MIN_LENGTH } from '@/lib/game-config';

interface PasswordChangeFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function PasswordChangeForm({ onSuccess, onError }: PasswordChangeFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      setError(`New password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || 'Failed to change password';
        setError(errorMsg);
        onError?.(errorMsg);
      } else {
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        onSuccess?.();
        setTimeout(() => {
          setShowForm(false);
          setSuccess('');
        }, 2000);
      }
    } catch (err: any) {
      const errorMsg = 'Something went wrong';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const divider = 'border-t border-gray-100 dark:border-surface-700';
  const rowBase = 'flex items-center w-full px-4 py-3 transition-colors';
  const rowLink = `${rowBase} hover:bg-gray-50 dark:hover:bg-surface-700`;
  const rowLabel = 'text-sm font-semibold text-gray-800 dark:text-surface-100 flex-1 text-left';
  const chevron = 'w-4 h-4 text-gray-300 dark:text-surface-600 shrink-0 ml-1';

  return (
    <>
      <button
        onClick={() => setShowForm(!showForm)}
        className={`${divider} ${rowLink}`}
      >
        <span className={rowLabel}>Change password</span>
        <ChevronRight className={`${chevron} transition-transform ${showForm ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-50 dark:border-surface-700 pt-3">
              {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
              {success && <p className="text-emerald-500 text-xs font-semibold">{success}</p>}
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-surface-700 border border-gray-200 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-gray-800 dark:text-surface-100"
              />
              <input
                type="password"
                placeholder={`New password (${PASSWORD_MIN_LENGTH}+ characters)`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={PASSWORD_MIN_LENGTH}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-surface-700 border border-gray-200 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-gray-800 dark:text-surface-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-sm transition-colors"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}
