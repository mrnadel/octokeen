'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getFakeUserById } from '@/lib/fake-user-generator';
import { getFakeAvatarUrl, getInitialsColor } from '@/lib/fake-avatar';
import { ProfileView } from '@/components/profile/ProfileView';
import type { ProfileData } from '@/components/profile/ProfileView';
import type { FrameStyleId } from '@/components/ui/AvatarFrame';

export default function CompetitorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const user = useMemo(() => {
    if (!id) return null;
    return getFakeUserById(id);
  }, [id]);

  if (!user) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-surface-950" style={{ minHeight: '100vh' }}>
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-surface-700">
          <div className="flex items-center h-14 px-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-surface-400" />
            </button>
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-surface-50 ml-2">Profile</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-20 px-6">
          <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-surface-700 dark:text-surface-200 font-bold text-lg">User not found</p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profileData: ProfileData = {
    displayName: user.name,
    image: getFakeAvatarUrl(user),
    totalXp: user.totalXp,
    currentStreak: user.currentStreak,
    accuracy: user.accuracy,
    joinedDate: user.joinDate,
    achievementIds: user.achievementsUnlocked,
    frameStyle: (user.frameStyle as FrameStyleId) || null,
    leagueTier: user.currentTier,
    avatarColor: getInitialsColor(user.id),
  };

  return <ProfileView data={profileData} />;
}
