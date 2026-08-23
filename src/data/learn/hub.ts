import type { GuideBlock, GuideRichText } from './types';

export interface LearnHubCopy {
  title: string;
  /** `<title>` without the brand suffix. Budget is 47 characters. */
  metaTitle: string;
  /** Meta description. Budget is 155 characters. */
  metaDescription: string;
  keywords: string[];
  intro: GuideRichText;
  body: GuideBlock[];
}

/** Editorial copy for the `/learn` hub. Pure content; the page adds the links. */
export const LEARN_HUB: LearnHubCopy = {
  title: 'Learn',
  metaTitle: 'Learn: Free Guides and Courses',
  metaDescription:
    'Free written guides and short daily lessons in psychology, space and astronomy, and personal finance. Read the answer first, then practise it.',
  keywords: ['free online courses', 'learn psychology', 'learn astronomy', 'learn personal finance'],
  intro:
    'Octokeen teaches general-knowledge subjects in five-minute lessons. This section is the written half of that: guides you can read straight through and finish knowing the thing, with a short practice check at the end rather than a paywall in the middle.',
  body: [
    { kind: 'heading', text: 'How this works' },
    {
      kind: 'paragraph',
      text: 'Each guide answers one question properly. You get the answer in the first paragraph, then the reasoning, the examples, and the distinctions that separate the concept from the three things it is usually confused with. At the bottom there are a few questions to check it stuck, and a route into the full course if you want more than one topic.',
    },
    {
      kind: 'paragraph',
      text: 'The courses themselves are the other half. They run on the two things the evidence actually supports for retention: spacing the practice out over days, and retrieving the answer rather than rereading it. That is why lessons are short and why they come back to the same material more than once.',
    },
    { kind: 'heading', text: 'What is here so far' },
    {
      kind: 'paragraph',
      text: 'The guides are written one at a time and there are not many of them yet, which is deliberate. A page that half answers a question is worse than no page, so this section grows slowly and only where there is something worth reading.',
    },
  ],
};
