import type { CourseQuestion } from '@/data/course/types';

const CURRENCY_UNIT = '$';
const PERCENT_UNIT = '%';

function formatSliderAnswer(question: CourseQuestion): string {
  const prefix = question.unit === CURRENCY_UNIT ? CURRENCY_UNIT : '';
  const value = question.correctValue?.toLocaleString() ?? '';
  const suffix =
    question.unit === PERCENT_UNIT
      ? PERCENT_UNIT
      : question.unit && question.unit !== CURRENCY_UNIT
        ? ` ${question.unit}`
        : '';
  return `${prefix}${value}${suffix}`;
}

/**
 * Human-readable rendering of a question's correct answer, shown in the
 * incorrect-answer feedback panel. Interactive types (teaching, drag/sort/tap)
 * reveal their own answer inline and return an empty string here.
 */
export function getCorrectAnswerDisplay(question: CourseQuestion | null): string {
  if (!question) return '';
  switch (question.type) {
    case 'multiple-choice':
      return question.options?.[question.correctIndex ?? 0] ?? '';
    case 'true-false':
      return question.correctAnswer ? 'True' : 'False';
    case 'fill-blank':
      return question.blanks?.join(', ') ?? question.acceptedAnswers?.[0] ?? '';
    case 'multi-select':
      return (question.correctIndices ?? [])
        .map((i) => question.options?.[i])
        .filter(Boolean)
        .join(', ');
    case 'slider-estimate':
      return formatSliderAnswer(question);
    case 'scenario':
    case 'pick-the-best':
      return question.options?.[question.correctIndex ?? 0] ?? '';
    case 'teaching':
    case 'sort-buckets':
    case 'match-pairs':
    case 'order-steps':
    case 'category-swipe':
    case 'rank-order':
    case 'image-tap':
      return '';
    default:
      return '';
  }
}
