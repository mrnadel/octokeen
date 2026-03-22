'use client';

import { create } from 'zustand';
import type { ContentFeedbackType, FeedbackReason, UserFlagItem } from '@/data/types';

function flagKey(contentType: ContentFeedbackType, contentId: string): string {
  return `${contentType}:${contentId}`;
}

interface FeedbackState {
  flags: Record<string, FeedbackReason>; // key: `${contentType}:${contentId}`
  comments: Record<string, string>; // key: `${contentType}:${contentId}`

  getFlag: (contentType: ContentFeedbackType, contentId: string) => FeedbackReason | null;
  setFlag: (contentType: ContentFeedbackType, contentId: string, reason: FeedbackReason) => void;
  removeFlag: (contentType: ContentFeedbackType, contentId: string) => void;
  setComment: (contentType: ContentFeedbackType, contentId: string, comment: string) => void;
  hydrateFlags: (items: UserFlagItem[]) => void;
}

export const useFeedbackStore = create<FeedbackState>()((set, get) => ({
  flags: {},
  comments: {},

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
      const nextFlags = { ...state.flags };
      const nextComments = { ...state.comments };
      const key = flagKey(contentType, contentId);
      delete nextFlags[key];
      delete nextComments[key];
      return { flags: nextFlags, comments: nextComments };
    });
  },

  setComment: (contentType, contentId, comment) => {
    set((state) => ({
      comments: { ...state.comments, [flagKey(contentType, contentId)]: comment },
    }));
  },

  hydrateFlags: (items) => {
    const flags: Record<string, FeedbackReason> = {};
    const comments: Record<string, string> = {};
    for (const item of items) {
      const key = flagKey(item.contentType, item.contentId);
      flags[key] = item.reason;
      if (item.comment) comments[key] = item.comment;
    }
    set({ flags, comments });
  },
}));
