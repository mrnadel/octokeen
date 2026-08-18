'use client';

import type { LessonTypeProps } from '@/data/course/types';
import ConversationView from './ConversationView';
import SpeedRoundView from './SpeedRoundView';
import TimelineView from './TimelineView';
import CaseStudyView from './CaseStudyView';

export interface LessonTypeSwitchProps extends LessonTypeProps {
  lessonType: string;
}

/** Single source of truth for the lesson-type → view-component mapping. */
export function LessonTypeSwitch({ lessonType, ...typeProps }: LessonTypeSwitchProps) {
  switch (lessonType) {
    case 'conversation':
      return <ConversationView {...typeProps} />;
    case 'speed-round':
      return <SpeedRoundView {...typeProps} />;
    case 'timeline':
      return <TimelineView {...typeProps} />;
    case 'case-study':
      return <CaseStudyView {...typeProps} />;
    default:
      return null;
  }
}
