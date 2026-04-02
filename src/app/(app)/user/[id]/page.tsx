'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ProfileView } from '@/components/profile/ProfileView';
import type { ProfileData } from '@/components/profile/ProfileView';

interface PublicProfile {
  id: string;
  displayName: string;
  image: string | null;
  joinedDate: string;
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
  leagueTier: number;
  achievements: string[];
  relationship: 'self' | 'friends' | 'request_sent' | 'request_received' | 'none';
  requestId?: string;
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/${id}/profile`)
      .then((res) => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then((data) => {
        if (data.relationship === 'self') {
          router.replace('/profile');
          return;
        }
        setProfile(data);
      })
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-[#FAFAFA] dark:bg-surface-950" style={{ minHeight: '100vh' }}>
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-surface-700">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-surface-400" />
            </button>
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-surface-50 ml-2">Profile</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-20 px-6">
          <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <div className="text-center">
            <p className="text-surface-700 dark:text-surface-200 font-bold text-lg mb-1">User not found</p>
            <p className="text-surface-400 dark:text-surface-500 text-sm">This user may have been removed or doesn&apos;t exist</p>
          </div>
          <Link
            href="/friends"
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            Back to Friends
          </Link>
        </div>
      </div>
    );
  }

  const profileData: ProfileData = {
    displayName: profile.displayName,
    image: profile.image,
    totalXp: profile.totalXp,
    currentStreak: profile.currentStreak,
    accuracy: profile.accuracy,
    joinedDate: profile.joinedDate,
    achievementIds: profile.achievements,
    leagueTier: profile.leagueTier,
  };

  return <ProfileView data={profileData} />;
}
