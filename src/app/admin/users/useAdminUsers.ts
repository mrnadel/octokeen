'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { PROFESSION_ID } from '@/data/professions';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  joinedDate: string | null;
  totalXp: number;
  currentStreak: number;
  totalQuestionsAttempted: number;
  lastActiveDate: string | null;
  tier: string;
  courseAccess: string[];
}

export type SortKey =
  | 'name'
  | 'email'
  | 'tier'
  | 'totalXp'
  | 'currentStreak'
  | 'totalQuestionsAttempted'
  | 'joinedDate'
  | 'lastActiveDate';

export type SortDir = 'asc' | 'desc';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'tier', label: 'Tier' },
  { key: 'totalXp', label: 'XP' },
  { key: 'currentStreak', label: 'Streak' },
  { key: 'totalQuestionsAttempted', label: 'Questions' },
  { key: 'joinedDate', label: 'Joined' },
  { key: 'lastActiveDate', label: 'Last Active' },
];

export interface UseAdminUsersReturn {
  // Data
  users: AdminUser[];
  total: number;
  sorted: AdminUser[];
  // Loading / error
  loading: boolean;
  error: string | null;
  updating: string | null;
  deleting: boolean;
  // Search & sort
  search: string;
  setSearch: (v: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  handleSort: (key: SortKey) => void;
  setSortKey: (key: SortKey) => void;
  setSortDir: (dir: SortDir) => void;
  // Selection
  selectedIds: Set<string>;
  handleSelect: (id: string, index: number, isShift: boolean) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  // Delete state
  deleteTarget: AdminUser | null;
  setDeleteTarget: (user: AdminUser | null) => void;
  confirmText: string;
  setConfirmText: (v: string) => void;
  bulkDeleteOpen: boolean;
  setBulkDeleteOpen: (v: boolean) => void;
  // Actions
  toggleTier: (userId: string, currentTier: string) => Promise<void>;
  toggleMeAccess: (userId: string, hasAccess: boolean) => Promise<void>;
  deleteUser: () => Promise<void>;
  bulkDelete: () => Promise<void>;
}

export function useAdminUsers(): UseAdminUsersReturn {
  const { status } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('joinedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const lastClickedIndex = useRef<number | null>(null);
  const shiftHeld = useRef(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === 'Shift') shiftHeld.current = true; };
    const up = (e: KeyboardEvent) => { if (e.key === 'Shift') shiftHeld.current = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    async function fetchUsers(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          setError(res.status === 403 ? 'Access denied' : 'Failed to load');
          return;
        }
        const data = await res.json() as { users: AdminUser[]; total: number };
        setUsers(data.users);
        setTotal(data.total);
      } catch {
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [status]);

  const toggleTier = async (userId: string, currentTier: string): Promise<void> => {
    const newTier = currentTier === 'pro' ? 'free' : 'pro';
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tier: newTier }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u)));
      }
    } catch {
      setError('Failed to update tier. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const toggleMeAccess = async (userId: string, hasAccess: boolean): Promise<void> => {
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/course-access', {
        method: hasAccess ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, professionId: PROFESSION_ID.MECHANICAL_ENGINEERING }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u;
            const access = hasAccess
              ? u.courseAccess.filter((c) => c !== PROFESSION_ID.MECHANICAL_ENGINEERING)
              : [...u.courseAccess, PROFESSION_ID.MECHANICAL_ENGINEERING];
            return { ...u, courseAccess: access };
          })
        );
      }
    } catch {
      setError('Failed to update access. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (): Promise<void> => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: deleteTarget.id }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setTotal((t) => t - 1);
        setDeleteTarget(null);
        setConfirmText('');
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? 'Failed to delete user');
      }
    } catch {
      setError('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const bulkDelete = async (): Promise<void> => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
        setTotal((t) => t - selectedIds.size);
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        setConfirmText('');
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? 'Failed to delete users');
      }
    } catch {
      setError('Failed to delete users');
    } finally {
      setDeleting(false);
    }
  };

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'email' ? 'asc' : 'desc');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.tier.toLowerCase().includes(q)
    );
  }, [users, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      switch (sortKey) {
        case 'name':
          aVal = (a.name ?? '').toLowerCase();
          bVal = (b.name ?? '').toLowerCase();
          break;
        case 'email':
          aVal = (a.email ?? '').toLowerCase();
          bVal = (b.email ?? '').toLowerCase();
          break;
        case 'tier':
          aVal = a.tier;
          bVal = b.tier;
          break;
        case 'totalXp':
          aVal = a.totalXp;
          bVal = b.totalXp;
          break;
        case 'currentStreak':
          aVal = a.currentStreak;
          bVal = b.currentStreak;
          break;
        case 'totalQuestionsAttempted':
          aVal = a.totalQuestionsAttempted;
          bVal = b.totalQuestionsAttempted;
          break;
        case 'joinedDate':
          aVal = a.joinedDate ? new Date(a.joinedDate).getTime() : 0;
          bVal = b.joinedDate ? new Date(b.joinedDate).getTime() : 0;
          break;
        case 'lastActiveDate':
          aVal = a.lastActiveDate ? new Date(a.lastActiveDate).getTime() : 0;
          bVal = b.lastActiveDate ? new Date(b.lastActiveDate).getTime() : 0;
          break;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const handleSelect = useCallback(
    (id: string, index: number, isShift: boolean): void => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (isShift && lastClickedIndex.current !== null && lastClickedIndex.current !== index) {
          const start = Math.min(lastClickedIndex.current, index);
          const end = Math.max(lastClickedIndex.current, index);
          for (let i = start; i <= end; i++) {
            next.add(sorted[i].id);
          }
        } else {
          if (next.has(id)) next.delete(id);
          else next.add(id);
        }
        return next;
      });
      lastClickedIndex.current = index;
    },
    [sorted]
  );

  const toggleSelectAll = (): void => {
    if (selectedIds.size === sorted.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map((u) => u.id)));
    }
  };

  const clearSelection = (): void => {
    setSelectedIds(new Set());
  };

  return {
    users,
    total,
    sorted,
    loading,
    error,
    updating,
    deleting,
    search,
    setSearch,
    sortKey,
    sortDir,
    handleSort,
    setSortKey,
    setSortDir,
    selectedIds,
    handleSelect,
    toggleSelectAll,
    clearSelection,
    deleteTarget,
    setDeleteTarget,
    confirmText,
    setConfirmText,
    bulkDeleteOpen,
    setBulkDeleteOpen,
    toggleTier,
    toggleMeAccess,
    deleteUser,
    bulkDelete,
  };
}
