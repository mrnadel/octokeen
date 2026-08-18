'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { STAGGER_DELAY } from '@/lib/game-config';
import { respondToFriendRequest, cancelFriendRequest } from './friends-api';

/** How long the accepted card stays visible before it collapses. */
const ACCEPTED_FADE_MS = 1000;

interface FriendRequestCardProps {
  id: string;
  userId: string;
  displayName: string;
  image: string | null;
  level: number;
  type: 'incoming' | 'outgoing';
  index: number;
  onAction?: () => void;
}

export default function FriendRequestCard({
  id,
  userId,
  displayName,
  image,
  level,
  type,
  index,
  onAction,
}: FriendRequestCardProps) {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  async function runAction(call: () => Promise<boolean>, onSuccess: () => void): Promise<void> {
    setLoading(true);
    setError('');
    try {
      if (await call()) {
        onSuccess();
        onAction?.();
      } else {
        setError('Failed');
      }
    } catch {
      setError('Failed');
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = () =>
    runAction(() => respondToFriendRequest(id, 'accept'), () => {
      setAccepted(true);
      setTimeout(() => setHidden(true), ACCEPTED_FADE_MS);
    });

  const handleDecline = () => runAction(() => respondToFriendRequest(id, 'decline'), () => setHidden(true));

  const handleCancel = () => runAction(() => cancelFriendRequest(id), () => setHidden(true));

  if (hidden) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * STAGGER_DELAY }}
      className="card-hover p-3 sm:p-4"
    >
      <div className="flex items-center gap-3">
        <Link href={`/user/${userId}`}>
          <UserAvatar image={image} name={displayName} size={44} />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/user/${userId}`}>
            <p className="text-sm font-bold text-surface-900 truncate">{displayName}</p>
          </Link>
          <p className="text-xs text-surface-400 font-semibold">
            {error ? <span className="text-red-500">{error}</span> : `Level ${level}`}
          </p>
        </div>

        {accepted ? (
          <span className="flex items-center gap-1.5 text-sm font-bold text-green-600 shrink-0">
            <Check className="w-4 h-4" />
            Added!
          </span>
        ) : loading ? (
          <LoadingSpinner size={20} card={false} />
        ) : type === 'incoming' ? (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleAccept}
              className="p-2 sm:p-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
              title="Accept"
              aria-label="Accept friend request"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleDecline}
              className="p-2 sm:p-2.5 rounded-lg bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
              title="Decline"
              aria-label="Decline friend request"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleCancel}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors shrink-0 min-h-[40px] sm:min-h-[44px]"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
