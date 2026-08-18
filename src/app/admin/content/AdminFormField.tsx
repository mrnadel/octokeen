'use client';

import type { CSSProperties, ReactNode } from 'react';
import { formFieldStyle, labelStyle } from './courseEditorStyles';

export interface AdminFormFieldProps {
  label: string;
  children: ReactNode;
  /** Extra styles merged onto the field wrapper — e.g. flex basis in a row. */
  style?: CSSProperties;
}

/** Labelled field wrapper used throughout the admin content editors. */
export default function AdminFormField({ label, children, style }: AdminFormFieldProps) {
  return (
    <div style={style ? { ...formFieldStyle, ...style } : formFieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
