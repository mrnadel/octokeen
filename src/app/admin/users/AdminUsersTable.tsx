'use client';

import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROFESSION_ID } from '@/data/professions';
import { AdminUser, SortKey, SortDir, SORT_OPTIONS } from './useAdminUsers';

function formatDate(value: string | null): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'name', label: 'User' },
  { key: 'tier', label: 'Tier', className: 'w-20' },
  { key: 'totalXp', label: 'XP', className: 'w-20 text-right' },
  { key: 'currentStreak', label: 'Streak', className: 'w-20 text-right' },
  { key: 'totalQuestionsAttempted', label: 'Qs', className: 'w-16 text-right' },
  { key: 'joinedDate', label: 'Joined', className: 'w-28' },
  { key: 'lastActiveDate', label: 'Last Active', className: 'w-28' },
];

interface SortIconProps {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}

function SortIcon({ col, sortKey, sortDir }: SortIconProps) {
  if (sortKey !== col) return <ChevronDown className="w-3 h-3 text-gray-300" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-gray-700" />
    : <ChevronDown className="w-3 h-3 text-gray-700" />;
}

export interface AdminUsersTableProps {
  sorted: AdminUser[];
  sortKey: SortKey;
  sortDir: SortDir;
  setSortKey: (key: SortKey) => void;
  setSortDir: (dir: SortDir) => void;
  handleSort: (key: SortKey) => void;
  selectedIds: Set<string>;
  handleSelect: (id: string, index: number, isShift: boolean) => void;
  toggleSelectAll: () => void;
  updating: string | null;
  toggleTier: (userId: string, currentTier: string) => Promise<void>;
  toggleMeAccess: (userId: string, hasAccess: boolean) => Promise<void>;
  onDeleteClick: (user: AdminUser) => void;
  onBulkDeleteClick: () => void;
  onClearSelection: () => void;
}

export function AdminUsersTable({
  sorted,
  sortKey,
  sortDir,
  setSortKey,
  setSortDir,
  handleSort,
  selectedIds,
  handleSelect,
  toggleSelectAll,
  updating,
  toggleTier,
  toggleMeAccess,
  onDeleteClick,
  onBulkDeleteClick,
  onClearSelection,
}: AdminUsersTableProps) {
  return (
    <>
      {/* Mobile sort dropdown */}
      <div className="md:hidden mb-2">
        <select
          value={`${sortKey}:${sortDir}`}
          onChange={(e) => {
            const [k, d] = e.target.value.split(':');
            setSortKey(k as SortKey);
            setSortDir(d as SortDir);
          }}
          className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.key}:desc`} value={`${opt.key}:desc`}>
              {opt.label} (High to Low)
            </option>
          ))}
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.key}:asc`} value={`${opt.key}:asc`}>
              {opt.label} (Low to High)
            </option>
          ))}
        </select>
      </div>

      {/* Bulk selection bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm font-semibold text-red-700">
            {selectedIds.size} user{selectedIds.size === 1 ? '' : 's'} selected
          </span>
          <button
            onClick={onBulkDeleteClick}
            className="ml-auto text-sm font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete Selected
          </button>
          <button
            onClick={onClearSelection}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={sorted.length > 0 && selectedIds.size === sorted.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      'px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none whitespace-nowrap',
                      col.className
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="w-28 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((user, idx) => (
                <tr
                  key={user.id}
                  className={cn(
                    'border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors',
                    selectedIds.has(user.id) && 'bg-primary-50/40'
                  )}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={(e) => e.preventDefault()}
                      onMouseDown={(e) => { e.preventDefault(); handleSelect(user.id, idx, e.shiftKey); }}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-gray-900 truncate max-w-[200px]">
                      {user.name || '-'}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                      {user.email || '-'}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        'inline-block text-[11px] font-bold px-2 py-0.5 rounded-md capitalize',
                        user.tier === 'pro'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-700">
                    {user.totalXp.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-700">
                    {user.currentStreak}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-700">
                    {user.totalQuestionsAttempted}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                    {formatDate(user.joinedDate)}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                    {formatDate(user.lastActiveDate)}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleTier(user.id, user.tier)}
                        disabled={updating === user.id}
                        className={cn(
                          'text-[11px] font-bold px-2.5 py-1.5 min-h-[32px] rounded-lg transition-colors disabled:opacity-50',
                          user.tier === 'pro'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        )}
                      >
                        {updating === user.id ? '...' : user.tier === 'pro' ? 'Revoke' : 'Grant'}
                      </button>
                      <button
                        onClick={() =>
                          toggleMeAccess(
                            user.id,
                            user.courseAccess.includes(PROFESSION_ID.MECHANICAL_ENGINEERING)
                          )
                        }
                        disabled={updating === user.id}
                        className={cn(
                          'text-[11px] font-bold px-2.5 py-1.5 min-h-[32px] rounded-lg transition-colors disabled:opacity-50',
                          user.courseAccess.includes(PROFESSION_ID.MECHANICAL_ENGINEERING)
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        )}
                        title={
                          user.courseAccess.includes(PROFESSION_ID.MECHANICAL_ENGINEERING)
                            ? 'Revoke ME access'
                            : 'Grant ME access'
                        }
                      >
                        ME
                      </button>
                      <button
                        onClick={() => onDeleteClick(user)}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2.5">
        {sorted.map((user, idx) => (
          <div
            key={user.id}
            className={cn(
              'bg-white rounded-xl border border-gray-200 p-3.5',
              selectedIds.has(user.id) && 'border-primary-300 bg-primary-50/30'
            )}
          >
            {/* Top row: checkbox + name + tier */}
            <div className="flex items-start gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedIds.has(user.id)}
                onChange={(e) => e.preventDefault()}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(user.id, idx, e.shiftKey); }}
                className="w-4 h-4 mt-1 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {user.name || '-'}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {user.email || '-'}
                </div>
              </div>
              <span
                className={cn(
                  'shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md capitalize',
                  user.tier === 'pro'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {user.tier}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 mb-2.5 text-xs">
              <div>
                <span className="text-gray-400 font-medium">XP </span>
                <span className="font-semibold text-gray-700">{user.totalXp.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Streak </span>
                <span className="font-semibold text-gray-700">{user.currentStreak}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Qs </span>
                <span className="font-semibold text-gray-700">{user.totalQuestionsAttempted}</span>
              </div>
            </div>

            {/* Dates + actions */}
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-gray-400">
                Joined {formatDate(user.joinedDate)}
                {user.lastActiveDate && <> · Active {formatDate(user.lastActiveDate)}</>}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleTier(user.id, user.tier)}
                  disabled={updating === user.id}
                  className={cn(
                    'text-[11px] font-bold px-2.5 py-2 min-h-[44px] rounded-lg transition-colors disabled:opacity-50',
                    user.tier === 'pro'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  )}
                >
                  {updating === user.id ? '...' : user.tier === 'pro' ? 'Revoke' : 'Grant'}
                </button>
                <button
                  onClick={() =>
                    toggleMeAccess(
                      user.id,
                      user.courseAccess.includes(PROFESSION_ID.MECHANICAL_ENGINEERING)
                    )
                  }
                  disabled={updating === user.id}
                  className={cn(
                    'text-[11px] font-bold px-2.5 py-2 min-h-[44px] rounded-lg transition-colors disabled:opacity-50',
                    user.courseAccess.includes(PROFESSION_ID.MECHANICAL_ENGINEERING)
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  )}
                >
                  ME
                </button>
                <button
                  onClick={() => onDeleteClick(user)}
                  className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
