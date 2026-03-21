'use client';

import { create } from 'zustand';
import type { ContentFeedbackType, FeedbackReason, UserFlagItem } from '@/data/types';

function flagKey(contentType: ContentFeedbackType, contentId: string): string {
  return `${contentType}:${contentId}`;
}

interface FeedbackState {
  flags: Record<string, FeedbackReason>; // key: `${contentType}:${contentId}`

  getFlag: (contentType: ContentFeedbackType, contentId: string) => FeedbackReason | null;
  setFlag: (contentType: ContentFeedbackType, contentId: string, reason: FeedbackReason) => void;
  removeFlag: (contentType: ContentFeedbackType, contentId: string) => void;
  hydrateFlags: (items: UserFlagItem[]) => void;
}

export const useFeedbackStore = create<FeedbackState>()((set, get) => ({
  flags: {},

  getFlag: (contentType, contentId) => {
    return get().flags[flagKey(contentType, contentId)] ?? null;
  },

  setFlag: (contentType, contentId, reason) => {
    set((state) => ({
      flags: { ...state.flags, [flagKey(contentType, contentId)]: reason },
    }));
  },

  removeFlag: (contentType, contentId) => {
    set((state) => {
      const next = { ...state.flags };
      delete next[flagKey(contentType, contentId)];
      return { flags: next };
    });
  },

  hydrateFlags: (items) => {
    const flags: Record<string, FeedbackReason> = {};
    for (const item of items) {
      flags[flagKey(item.contentType, item.contentId)] = item.reason;
    }
    set({ flags });
  },
}));
