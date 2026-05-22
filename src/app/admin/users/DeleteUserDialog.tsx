'use client';

import { X } from 'lucide-react';
import { AdminUser } from './useAdminUsers';

export interface DeleteUserDialogProps {
  // Single-user delete
  deleteTarget: AdminUser | null;
  onCancelSingle: () => void;
  onConfirmSingle: () => void;
  // Bulk delete
  bulkDeleteOpen: boolean;
  selectedCount: number;
  onCancelBulk: () => void;
  onConfirmBulk: () => void;
  // Shared
  confirmText: string;
  onConfirmTextChange: (v: string) => void;
  deleting: boolean;
}

export function DeleteUserDialog({
  deleteTarget,
  onCancelSingle,
  onConfirmSingle,
  bulkDeleteOpen,
  selectedCount,
  onCancelBulk,
  onConfirmBulk,
  confirmText,
  onConfirmTextChange,
  deleting,
}: DeleteUserDialogProps) {
  const isConfirmed = confirmText === 'DELETE';

  return (
    <>
      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteOpen && selectedCount > 0 && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete {selectedCount} User{selectedCount === 1 ? '' : 's'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
              <button
                onClick={onCancelBulk}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-red-50 rounded-xl p-3.5 mb-4">
              <p className="text-sm text-red-800">
                You are about to permanently delete{' '}
                <strong>{selectedCount} user{selectedCount === 1 ? '' : 's'}</strong> and all their
                data including progress, subscriptions, and payment history.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Type{' '}
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-600">
                  DELETE
                </span>{' '}
                to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => onConfirmTextChange(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancelBulk}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmBulk}
                disabled={!isConfirmed || deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting
                  ? 'Deleting...'
                  : `Delete ${selectedCount} User${selectedCount === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
              <button
                onClick={onCancelSingle}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-red-50 rounded-xl p-3.5 mb-4">
              <p className="text-sm text-red-800">
                You are about to permanently delete{' '}
                <strong>{deleteTarget.name || deleteTarget.email}</strong> and all their data
                including progress, subscriptions, and payment history.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Type{' '}
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-600">
                  DELETE
                </span>{' '}
                to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => onConfirmTextChange(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancelSingle}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmSingle}
                disabled={!isConfirmed || deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
