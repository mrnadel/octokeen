'use client';

import React from 'react';
import { IconProps } from '../types';

export type FrameIconProps = IconProps;

// ============================================================================
// Helper: avatar placeholder circle (gray circle representing user avatar)
// ============================================================================
export const AvatarPlaceholder = () => (
  <circle cx="32" cy="32" r="16" fill="#D1D5DB" />
);
