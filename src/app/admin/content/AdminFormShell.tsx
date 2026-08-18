'use client';

import type { ReactNode } from 'react';
import { btnPrimary, btnSecondary, formActions, formSectionStyle } from './courseEditorStyles';

const HEADING_STYLE: React.CSSProperties = { fontSize: 15, fontWeight: 700, margin: '0 0 16px' };

export interface AdminFormShellProps {
  heading: string;
  /** Label on the submit button when idle — e.g. "Create Unit". */
  submitLabel: string;
  saving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  children: ReactNode;
}

/**
 * Form chrome shared by the unit, lesson and question editors:
 * card, heading, and the save / cancel action row.
 */
export default function AdminFormShell({
  heading,
  submitLabel,
  saving,
  onSubmit,
  onCancel,
  children,
}: AdminFormShellProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form style={formSectionStyle} onSubmit={handleSubmit}>
      <h3 style={HEADING_STYLE}>{heading}</h3>

      {children}

      <div style={formActions}>
        <button type="submit" style={btnPrimary} disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
        <button type="button" style={btnSecondary} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
