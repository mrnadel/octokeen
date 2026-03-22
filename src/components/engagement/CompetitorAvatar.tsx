'use client';

import { useMemo } from 'react';
import { getFakeUserById } from '@/lib/fake-user-generator';
import { getFakeAvatarUrl, getInitialsColor } from '@/lib/fake-avatar';

interface CompetitorAvatarProps {
  fakeUserId?: string;
  avatarInitial: string;
  isUser: boolean;
  size?: number; // px, default 32
}

export function CompetitorAvatar({
  fakeUserId,
  avatarInitial,
  isUser,
  size = 32,
}: CompetitorAvatarProps) {
  const avatarUrl = useMemo(() => {
    if (isUser || !fakeUserId) return null;
    const user = getFakeUserById(fakeUserId);
    if (!user) return null;
    return getFakeAvatarUrl(user);
  }, [fakeUserId, isUser]);

  const bgColor = useMemo(() => {
    if (isUser) return '#4F46E5';
    if (avatarUrl) return 'transparent';
    return fakeUserId ? getInitialsColor(fakeUserId) : '#6B7280';
  }, [isUser, avatarUrl, fakeUserId]);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="rounded-full flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: bgColor,
        fontSize: size * 0.4,
      }}
    >
      {avatarInitial}
    </div>
  );
}
