'use client';

import { CourseHeader } from '@/components/course/CourseHeader';
import { CourseMap } from '@/components/course/CourseMap';
import { LessonView } from '@/components/lesson/LessonView';
import { ResultScreen } from '@/components/lesson/ResultScreen';
import { useCourseStore } from '@/store/useCourseStore';

export default function CoursePage() {
  const { activeLesson, lessonResult } = useCourseStore();

  return (
    <>
      <CourseHeader />
      <CourseMap />
      {activeLesson && <LessonView />}
      {lessonResult && <ResultScreen />}
    </>
  );
}
