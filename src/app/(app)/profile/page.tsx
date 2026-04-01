'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import NextImage from 'next/image';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { useCourseStore } from '@/store/useCourseStore';
import { getXpToNextLevel } from '@/data/levels';
import { achievements } from '@/data/achievements';
import {
  Edit3,
  Check,
  X,
  ChevronRight,
  Crown,
  Camera,
  Trash2,
  Loader2,
  Settings,
  Star,
  Zap,
  Target,
  BookOpen,
  Flame,
  HelpCircle,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsDark } from '@/store/useThemeStore';
import { useSubscription } from '@/hooks/useSubscription';
import { useGems, useEngagementStore } from '@/store/useEngagementStore';
import { leagueTiers } from '@/data/league';
import { shopItems, findFrameById, findTitleById } from '@/data/gem-shop';
import { AvatarFrame } from '@/components/ui/AvatarFrame';
import type { FrameStyleId } from '@/components/ui/AvatarFrame';
import InviteShare from '@/components/friends/InviteShare';
import { PageHeader } from '@/components/ui/PageHeader';

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

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived data
  const displayName = session?.user?.name || progress.displayName || 'Engineer';
  const email = session?.user?.email || '';
  const image = session?.user?.image;
  const joinedDate = progress.joinedDate;

  const totalXp = progress.totalXp + courseProgress.totalXp;
  const currentStreak = Math.max(progress.currentStreak, courseProgress.currentStreak);
  const totalQuestions = progress.totalQuestionsAttempted;
  const accuracy = totalQuestions > 0 ? Math.round((progress.totalQuestionsCorrect / totalQuestions) * 100) : 0;

  const levelInfo = useMemo(() => getXpToNextLevel(totalXp), [totalXp]);
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => progress.achievementsUnlocked.includes(a.id)),
    [progress.achievementsUnlocked]
  );

  // Highlights
  const longestStreak = Math.max(progress.longestStreak, courseProgress.longestStreak);
  const lessonsCompleted = Object.values(courseProgress.completedLessons || {}).filter((l: any) => l?.passed).length;
  const leagueTier = useEngagementStore((s) => s.league.currentTier);
  const leagueInfo = leagueTiers.find((l) => l.tier === leagueTier) || leagueTiers[0];

  const initial = displayName.charAt(0).toUpperCase();
  const bgColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#EC4899'];
  const bgColor = bgColors[initial.charCodeAt(0) % bgColors.length];

  // ── Handlers ──────────────────────────────────────────
  const handleSaveName = async () => {
    if (!newName.trim() || newName.trim().length < 2) return;
    setNameLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: newName.trim() }),
      });
      if (res.ok) {
        useStore.setState((state) => ({ progress: { ...state.progress, displayName: newName.trim() } }));
        useCourseStore.setState((state) => ({ progress: { ...state.progress, displayName: newName.trim() } }));
        await updateSession({ name: newName.trim() });
        setEditingName(false);
      } else {
        setAvatarError('Failed to update name');
        setTimeout(() => setAvatarError(''), 4000);
      }
    } catch {
      setAvatarError('Failed to update name');
      setTimeout(() => setAvatarError(''), 4000);
    } finally {
      setNameLoading(false);
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-surface-950 pb-10">
      <PageHeader
        title="Profile"
        trailing={
          <Link href="/settings" className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-[10px] bg-[#F0F0F0] dark:bg-surface-800 transition-transform active:scale-90">
            <Settings className="w-5 h-5 text-[#777] dark:text-surface-400" />
          </Link>
        }
      />

      <div className="px-4 sm:px-5 pt-5 space-y-4">
        {/* ── Identity Card ──────────────────────────────── */}
        <div className="card dark:bg-surface-900 dark:border-surface-700 p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
              <AvatarFrame frameStyle={equippedFrameStyle as FrameStyleId} size={80}>
                {image ? (
                  <NextImage src={image} alt={displayName} width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-extrabold" style={{ background: bgColor }}>
                    {initial}
                  </div>
                )}
              </AvatarFrame>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-md transition-colors"
              >
                {avatarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              {image && !avatarUploading && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 hover:bg-danger-400 text-white rounded-full flex items-center justify-center shadow transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <AnimatePresence mode="wait">
                {editingName ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                    <input
                      type="text" value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-surface-100 dark:bg-surface-800 border-2 border-primary-400 rounded-lg text-sm font-bold text-surface-900 dark:text-surface-50 focus:outline-none"
                      autoFocus maxLength={50}
                    />
                    <button onClick={handleSaveName} disabled={nameLoading} className="p-1.5 bg-accent-500 text-white rounded-lg hover:bg-accent-400 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingName(false)} className="p-1.5 bg-surface-200 dark:bg-surface-700 text-surface-500 rounded-lg hover:bg-surface-300 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-lg font-extrabold text-[#3C3C3C] dark:text-surface-50 truncate">{displayName}</h2>
                      <button onClick={() => { setNewName(displayName); setEditingName(true); }} className="p-1 text-surface-400 hover:text-surface-600 transition-colors shrink-0">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title badge */}
              {equippedTitle && (
                <span
                  className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest"
                  style={equippedTitleGradient ? {
                    background: equippedTitleGradient,
                    color: '#FFF',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  } : {
                    background: isDark ? 'rgba(251,191,36,0.15)' : '#FFFBEB',
                    border: '1px solid rgba(251,191,36,0.3)',
                    color: '#B45309',
                  }}
                >
                  {equippedTitleItem?.icon && <span className="text-[10px]">{equippedTitleItem.icon}</span>}
                  {equippedTitle}
                </span>
              )}

              <p className="text-xs text-[#AFAFAF] dark:text-surface-500 mt-1 truncate">{email}</p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 dark:text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">
                  <Crown className="w-3 h-3" />
                  Lvl {levelInfo.current.level} {levelInfo.current.title}
                </span>
                {subFetched && isProUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide bg-gradient-to-r from-brand-400 to-brand-600 text-white shadow-sm">
                    <Star className="w-3 h-3" fill="currentColor" /> PRO
                  </span>
                )}
                {joinedDate && (
                  <span className="text-[11px] text-[#AFAFAF] dark:text-surface-500">
                    Joined {new Date(joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Avatar error */}
          <AnimatePresence>
            {avatarError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs text-danger-600 bg-danger-50 dark:bg-danger-900/20 dark:text-danger-400 rounded-lg py-2 px-3 mt-3 text-center"
              >
                {avatarError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* XP Progress */}
          {levelInfo.next && (
            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-surface-500 uppercase tracking-wider">Next Level</span>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                  {totalXp.toLocaleString()} / {levelInfo.next.xpRequired.toLocaleString()} XP
                </span>
              </div>
              <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(levelInfo.progress * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-[#AFAFAF] dark:text-surface-500 mt-1 text-right">
                {levelInfo.xpNeeded.toLocaleString()} XP to {levelInfo.next.title} {levelInfo.next.icon}
              </p>
            </div>
          )}
        </div>

        {/* ── Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Star, label: 'Total XP', value: totalXp.toLocaleString(), color: 'text-brand-500' },
            { icon: Zap, label: 'Streak', value: `${currentStreak}d`, color: 'text-orange-500' },
            { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: 'text-accent-500' },
          ].map((stat) => (
            <div key={stat.label} className="card dark:bg-surface-900 dark:border-surface-700 p-3 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className={`text-lg font-extrabold tabular-nums ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#AFAFAF] dark:text-surface-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Collection (Frames & Titles) ───────────────── */}
        {(gems.inventory.activeTitles.length > 0 || gems.inventory.activeFrames.length > 0) && (
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

        {/* ── Highlights ──────────────────────────────────── */}
        <div>
          <h3 className="text-sm font-extrabold text-[#3C3C3C] dark:text-surface-100 mb-2.5">Highlights</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: BookOpen, label: 'Lessons', value: lessonsCompleted, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
              { icon: Flame, label: 'Best Streak', value: `${longestStreak}d`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { icon: HelpCircle, label: 'Questions', value: totalQuestions.toLocaleString(), color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
              { icon: Award, label: 'League', value: `${leagueInfo.icon} ${leagueInfo.name}`, color: 'text-brand-600 dark:text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
            ].map((item) => (
              <div key={item.label} className="card dark:bg-surface-900 dark:border-surface-700 p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-base font-extrabold tabular-nums leading-tight ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#AFAFAF] dark:text-surface-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Achievements ───────────────────────────────── */}
        {unlockedAchievements.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-extrabold text-[#3C3C3C] dark:text-surface-100">
                Achievements
                <span className="ml-2 text-xs font-bold text-[#AFAFAF]">{unlockedAchievements.length}/{achievements.length}</span>
              </h3>
              <Link href="/achievements" className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {unlockedAchievements.slice(0, 4).map((ach) => (
                <div key={ach.id} className="card dark:bg-surface-900 dark:border-surface-700 flex items-center gap-3 p-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-base shrink-0">
                    {ach.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#3C3C3C] dark:text-surface-100 truncate">{ach.name}</p>
                    <p className="text-[11px] text-[#AFAFAF] dark:text-surface-500 truncate">{ach.description}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-500 shrink-0">+{ach.xpReward}</span>
                </div>
              ))}
              {unlockedAchievements.length > 4 && (
                <Link href="/achievements" className="block text-center text-xs font-bold text-[#AFAFAF] hover:text-primary-500 py-2 transition-colors">
                  +{unlockedAchievements.length - 4} more
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ── Invite Friends ─────────────────────────────── */}
        <InviteShare />
      </div>
    </div>
  );
}
