'use client';

interface AdminSpinnerProps {
  label?: string;
}

export function AdminSpinner({ label }: AdminSpinnerProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
        {label && <p className="text-sm text-gray-500">{label}</p>}
      </div>
    </div>
  );
}
