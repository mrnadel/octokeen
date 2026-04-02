'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Settings, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useSubscription } from '@/hooks/useSubscription';
import { useGems, useEngagementStore } from '@/store/useEngagementStore';
import { useIsDark } from '@/store/useThemeStore';
import { shopItems, findFrameById, findTitleById } from '@/data/gem-shop';
import { AvatarFrame } from '@/components/ui/AvatarFrame';
import type { FrameStyleId } from '@/components/ui/AvatarFrame';
import { ProfileView } from '@/components/profile/ProfileView';
import type { ProfileData, OwnProfileConfig } from '@/components/profile/ProfileView';
import InviteShare from '@/components/friends/InviteShare';

// ── Image compression ──────────────────────────────────────
const MAX_UPLOAD_MB = 5;
const OUTPUT_SIZE = 128;
const JPEG_QUALITY = 0.6;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      reject(new Error(`File too large. Max ${MAX_UPLOAD_MB}MB.`));
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not a valid image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext('2d')!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════
export default function ProfilePage() {
  const isDark = useIsDark();
  const { data: session, update: updateSession } = useSession();
  const progress = useStore((s) => s.progress);
  const courseProgress = useCourseStore((s) => s.progress);
  const { isProUser, hasFetched: subFetched } = useSubscription();
  const gems = useGems();

  // Cosmetics
  const equippedTitle = gems.selectedTitle ? findTitleById(gems.selectedTitle) : undefined;
  const equippedTitleItem = gems.selectedTitle ? shopItems.find((i) => i.id === gems.selectedTitle) : null;
  const equippedTitleGradient = (equippedTitleItem?.metadata?.gradient as string) || null;
  const equippedFrameMeta = gems.selectedFrame ? findFrameById(gems.selectedFrame) : null;
  const equippedFrameStyle = equippedFrameMeta?.frameStyle;

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  // Derived data
  const displayName = session?.user?.name || progress.displayName || 'Engineer';
  const image = session?.user?.image || null;
  const totalXp = progress.totalXp + courseProgress.totalXp;
  const currentStreak = Math.max(progress.currentStreak, courseProgress.currentStreak);
  const totalQuestions = progress.totalQuestionsAttempted;
  const accuracy = totalQuestions > 0 ? Math.round((progress.totalQuestionsCorrect / totalQuestions) * 100) : 0;
  const leagueTier = useEngagementStore((s) => s.league.currentTier);

  // ── Handlers ──────────────────────────────────────────
  const handleSaveName = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name }),
      });
      if (res.ok) {
        useStore.setState((state) => ({ progress: { ...state.progress, displayName: name } }));
        useCourseStore.setState((state) => ({ progress: { ...state.progress, displayName: name } }));
        await updateSession({ name });
        return true;
      }
      setAvatarError('Failed to update name');
      setTimeout(() => setAvatarError(''), 4000);
      return false;
    } catch {
      setAvatarError('Failed to update name');
      setTimeout(() => setAvatarError(''), 4000);
      return false;
    }
  };

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setAvatarError('');
    setAvatarUploading(true);
    try {
      const compressed = await compressImage(file);
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      await updateSession({ image: compressed });
    } catch (err: any) {
      setAvatarError(err.message || 'Upload failed');
      setTimeout(() => setAvatarError(''), 4000);
    } finally {
      setAvatarUploading(false);
    }
  }, [updateSession]);

  const handleRemoveAvatar = useCallback(async () => {
    setAvatarUploading(true);
    setAvatarError('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: null }),
      });
      if (res.ok) {
        await updateSession({ image: '' });
      } else {
        setAvatarError('Failed to remove avatar');
        setTimeout(() => setAvatarError(''), 4000);
      }
    } catch {
      setAvatarError('Failed to remove avatar');
      setTimeout(() => setAvatarError(''), 4000);
    } finally {
      setAvatarUploading(false);
    }
  }, [updateSession]);

  // ── Build props ────────────────────────────────────────
  const profileData: ProfileData = {
    displayName,
    image,
    totalXp,
    currentStreak,
    accuracy,
    joinedDate: progress.joinedDate,
    achievementIds: progress.achievementsUnlocked,
    frameStyle: equippedFrameStyle as FrameStyleId,
    leagueTier,
  };

  const ownProfileConfig: OwnProfileConfig = {
    isProUser: subFetched && isProUser,
    equippedTitle: equippedTitle ? {
      text: equippedTitle,
      icon: equippedTitleItem?.icon,
      gradient: equippedTitleGradient,
    } : null,
    onSaveName: handleSaveName,
    onAvatarUpload: handleAvatarUpload,
    onRemoveAvatar: handleRemoveAvatar,
    avatarUploading,
    avatarError,
  };

  const initial = displayName.charAt(0).toUpperCase();
  const bgColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#EC4899'];
  const bgColor = bgColors[initial.charCodeAt(0) % bgColors.length];
  const hasCollection = gems.inventory.activeTitles.length > 0 || gems.inventory.activeFrames.length > 0;

  return (
    <ProfileView
      data={profileData}
      ownProfile={ownProfileConfig}
      headerTrailing={
        <Link href="/settings" className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] bg-[#F0F0F0] dark:bg-surface-800 transition-transform active:scale-90">
          <Settings className="w-5 h-5 text-[#777] dark:text-surface-400" />
        </Link>
      }
      footer={<InviteShare />}
    >
      {/* ── Collection (Frames & Titles) ───────────────── */}
      {hasCollection && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-extrabold text-[#3C3C3C] dark:text-surface-100">My Collection</h3>
            <Link href="/shop" className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5 transition-colors">
              Shop <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {gems.inventory.activeFrames.length > 0 && (
            <div className="card dark:bg-surface-900 dark:border-surface-700 p-4 mb-3">
              <p className="text-[11px] font-bold text-[#AFAFAF] dark:text-surface-500 uppercase tracking-wider mb-3">Avatar Frame</p>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                <button onClick={() => useEngagementStore.getState().equipFrame(null)} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="rounded-xl p-1.5 transition-all" style={{
                    border: !gems.selectedFrame ? '2px solid #0D9488' : '2px solid transparent',
                    background: !gems.selectedFrame ? (isDark ? 'rgba(13,148,136,0.12)' : '#F0FDF4') : (isDark ? '#0F172A' : '#F9FAFB'),
                  }}>
                    <AvatarFrame frameStyle={null} size={48}>
                      <div className="w-full h-full flex items-center justify-center text-base font-extrabold text-white" style={{ background: bgColor }}>{initial}</div>
                    </AvatarFrame>
                  </div>
                  <span className="text-[10px] font-bold text-[#AFAFAF]">None</span>
                </button>
                {gems.inventory.activeFrames.map((frameId) => {
                  const frameMeta = findFrameById(frameId);
                  if (!frameMeta) return null;
                  const isEquipped = gems.selectedFrame === frameId;
                  const fStyle = frameMeta.frameStyle as FrameStyleId;
                  const borderColor = frameMeta.borderColor;
                  return (
                    <button key={frameId} onClick={() => useEngagementStore.getState().equipFrame(isEquipped ? null : frameId)} className="flex flex-col items-center gap-1 shrink-0">
                      <div className="rounded-xl p-1.5 transition-all" style={{
                        border: isEquipped ? `2px solid ${borderColor}` : '2px solid transparent',
                        background: isEquipped ? `${borderColor}15` : (isDark ? '#0F172A' : '#F9FAFB'),
                      }}>
                        <AvatarFrame frameStyle={fStyle} size={48}>
                          <div className="w-full h-full flex items-center justify-center text-base font-extrabold text-white" style={{ background: bgColor }}>{initial}</div>
                        </AvatarFrame>
                      </div>
                      <span className={`text-[10px] font-bold ${isEquipped ? 'text-[#3C3C3C] dark:text-surface-100' : 'text-[#AFAFAF]'}`}>
                        {frameMeta.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {gems.inventory.activeTitles.length > 0 && (
            <div className="card dark:bg-surface-900 dark:border-surface-700 p-4">
              <p className="text-[11px] font-bold text-[#AFAFAF] dark:text-surface-500 uppercase tracking-wider mb-3">Title</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => useEngagementStore.getState().equipTitle(null)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: !gems.selectedTitle ? (isDark ? 'rgba(13,148,136,0.12)' : '#F0FDF4') : (isDark ? '#0F172A' : '#F9FAFB'),
                    border: !gems.selectedTitle ? '2px solid #0D9488' : (isDark ? '2px solid #334155' : '2px solid #E5E7EB'),
                    color: !gems.selectedTitle ? '#0D9488' : (isDark ? '#94A3B8' : '#6B7280'),
                  }}
                >
                  None
                </button>
                {gems.inventory.activeTitles.map((titleId) => {
                  const titleText = findTitleById(titleId);
                  if (!titleText) return null;
                  const isEquipped = gems.selectedTitle === titleId;
                  const sItem = shopItems.find((i) => i.id === titleId);
                  const icon = sItem?.icon || '';
                  const titleGradient = (sItem?.metadata?.gradient as string) || null;
                  const titleAccent = (sItem?.metadata?.accentColor as string) || '#F59E0B';
                  return (
                    <button
                      key={titleId}
                      onClick={() => useEngagementStore.getState().equipTitle(isEquipped ? null : titleId)}
                      className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all overflow-hidden"
                      style={isEquipped && titleGradient ? {
                        background: titleGradient,
                        border: '2px solid transparent',
                        color: '#FFF',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        boxShadow: `0 2px 8px ${titleAccent}40`,
                      } : {
                        background: titleGradient
                          ? `linear-gradient(${isDark ? '#1E293B' : 'white'}, ${isDark ? '#1E293B' : 'white'}) padding-box, ${titleGradient} border-box`
                          : (isDark ? '#0F172A' : '#F9FAFB'),
                        border: titleGradient ? '2px solid transparent' : (isDark ? '2px solid #334155' : '2px solid #E5E7EB'),
                        color: titleAccent || (isDark ? '#94A3B8' : '#6B7280'),
                      }}
                    >
                      {icon && <span>{icon}</span>}
                      <span>{titleText}</span>
                      {isEquipped && <span className="ml-0.5">&#10003;</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </ProfileView>
  );
}
