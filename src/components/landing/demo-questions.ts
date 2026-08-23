export interface DemoQuestion {
  topic: string;
  topicColor: string;
  question: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

/** Three-question taster shown on the landing page. */
export const DEMO_QUESTIONS: readonly DemoQuestion[] = [
  {
    topic: 'Everyday Physics', topicColor: '#14B8A6',
    question: 'Why does a wet phone screen stop responding to your touch?',
    options: ['Water conducts electricity and confuses the sensor', 'Your fingers lose their charge when wet', 'The screen glass gets too slippery', 'Water blocks Bluetooth signals'],
    correctIndex: 0,
    explanation: 'Touchscreens detect tiny electrical signals from your fingertip. Water conducts electricity too, creating false touches everywhere.',
    xp: 20,
  },
  {
    topic: 'Quick Think', topicColor: '#F59E0B',
    question: 'Is it true that hot water freezes faster than cold water?',
    options: ['Yes, it can', 'No, never'],
    correctIndex: 0,
    explanation: "It's called the Mpemba effect. Under certain conditions, hot water actually does freeze faster. Scientists still debate exactly why.",
    xp: 15,
  },
  {
    topic: 'Real World', topicColor: '#8B5CF6',
    question: 'Why do bridges have expansion joints (gaps) in them?',
    options: ['So the bridge can expand in heat without cracking', 'To let rainwater drain through', 'To reduce the weight of the bridge', 'For decoration and visual appeal'],
    correctIndex: 0,
    explanation: 'Materials expand when heated. Without gaps, a bridge could buckle on a hot day. Expansion joints give the structure room to grow and shrink safely.',
    xp: 20,
  },
];
