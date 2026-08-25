import React from 'react';
import { C } from '../theme';

/** The app's 3D-press button: flat face sitting on an offset darker shadow. */
export const PrimaryButton: React.FC<{
  label: string;
  color?: string;
  shadow?: string;
  style?: React.CSSProperties;
}> = ({ label, color = C.emerald, shadow = '#047857', style }) => (
  <div
    style={{
      background: color,
      boxShadow: `0 8px 0 ${shadow}`,
      borderRadius: 26,
      padding: '32px 0',
      textAlign: 'center',
      color: C.white,
      fontSize: 44,
      fontWeight: 800,
      ...style,
    }}
  >
    {label}
  </div>
);
