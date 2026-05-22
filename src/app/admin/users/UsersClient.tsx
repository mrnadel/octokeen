'use client';

import { useSession } from 'next-auth/react';
import { Search } from 'lucide-react';
import { useAdminUsers } from './useAdminUsers';
import { AdminUsersTable } from './AdminUsersTable';
import { DeleteUserDialog } from './DeleteUserDialog';

export default function AdminUsersPage() {
  const { status } = useSession();
  const {
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
  } = useAdminUsers();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">Not authenticated</p>
          <a href="/login" className="text-primary-600 text-sm font-medium hover:underline mt-1 inline-block">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">Users</h1>
      <p className="text-sm text-gray-500 mb-4 md:mb-5">
        {loading ? 'Loading...' : `${total} registered user${total === 1 ? '' : 's'}`}
        {search && !loading && ` · ${sorted.length} match${sorted.length === 1 ? '' : 'es'}`}
      </p>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or tier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!loading && !error && sorted.length === 0 && (
        <p className="text-gray-400 text-sm py-8 text-center">
          {search ? 'No users match your search.' : 'No users found.'}
        </p>
      )}

      {!loading && !error && sorted.length > 0 && (
        <AdminUsersTable
          sorted={sorted}
          sortKey={sortKey}
          sortDir={sortDir}
          setSortKey={setSortKey}
          setSortDir={setSortDir}
          handleSort={handleSort}
          selectedIds={selectedIds}
          handleSelect={handleSelect}
          toggleSelectAll={toggleSelectAll}
          updating={updating}
          toggleTier={toggleTier}
          toggleMeAccess={toggleMeAccess}
          onDeleteClick={(user) => { setDeleteTarget(user); setConfirmText(''); }}
          onBulkDeleteClick={() => { setBulkDeleteOpen(true); setConfirmText(''); }}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      <DeleteUserDialog
        deleteTarget={deleteTarget}
        onCancelSingle={() => { setDeleteTarget(null); setConfirmText(''); }}
        onConfirmSingle={deleteUser}
        bulkDeleteOpen={bulkDeleteOpen}
        selectedCount={selectedIds.size}
        onCancelBulk={() => { setBulkDeleteOpen(false); setConfirmText(''); }}
        onConfirmBulk={bulkDelete}
        confirmText={confirmText}
        onConfirmTextChange={setConfirmText}
        deleting={deleting}
      />
    </div>
  );
}
