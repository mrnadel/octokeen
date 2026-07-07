'use client';

import { memo, useMemo } from 'react';
import { getFakeUserById } from '@/lib/fake-user-generator';
import { getFakeAvatarUrl, getInitialsColor } from '@/lib/fake-avatar';
import { AvatarFrame } from '@/components/ui/AvatarFrame';
import { AvatarBase } from '@/components/ui/AvatarBase';
import type { FrameStyleId } from '@/components/ui/AvatarFrame';

interface CompetitorAvatarProps {
  fakeUserId?: string;
  avatarInitial: string;
  isUser: boolean;
  size?: number; // px, default 32
  frameStyle?: string;
}

export const CompetitorAvatar = memo(function CompetitorAvatar({
  fakeUserId,
  avatarInitial,
  isUser,
  size = 32,
  frameStyle,
}: CompetitorAvatarProps) {
  const avatarUrl = useMemo(() => {
    if (isUser || !fakeUserId) return null;
    const user = getFakeUserById(fakeUserId);
    if (!user) return null;
    return getFakeAvatarUrl(user);
  }, [fakeUserId, isUser]);

  const bgColor = useMemo(() => {
    if (isUser) return '#2563EB';
    if (avatarUrl) return 'transparent';
    return fakeUserId ? getInitialsColor(fakeUserId) : '#6B7280';
  }, [isUser, avatarUrl, fakeUserId]);

  const hasFrame = !isUser && !!frameStyle;
  const innerSize = hasFrame ? size - 8 : size;

  if (hasFrame) {
    const frameSize = size + 8;
    return (
      <div className="flex-shrink-0" style={{ width: frameSize, height: frameSize, margin: -4 }}>
        <AvatarFrame frameStyle={frameStyle as FrameStyleId} size={frameSize}>
          <AvatarBase
            size={innerSize}
            name={avatarInitial}
            image={avatarUrl}
            bgColor={bgColor}
            initialsClass="text-white"
            initialsFontSize={innerSize * 0.4}
          />
        </AvatarFrame>
      </div>
    );
  }

  return (
    <AvatarBase
      size={innerSize}
      name={avatarInitial}
      image={avatarUrl}
      bgColor={bgColor}
      initialsClass="text-white"
      initialsFontSize={innerSize * 0.4}
      className="flex-shrink-0"
    />
  );
});
