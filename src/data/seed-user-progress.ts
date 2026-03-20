import type { UserProgress } from './types';

/**
 * Realistic mock user progress data.
 * Represents an engineer who has been using the app for ~2 weeks.
 * - Strong in Strength of Materials and Machine Elements
 * - Weak in Thermodynamics and Heat Transfer
 * - Current streak of 5 days
 * - Level 8 (Project Engineer)
 * - Mix of achievements unlocked
 */
export const seedUserProgress: UserProgress = {
  userId: 'user-demo-001',
  displayName: 'Alex Chen',
  joinedDate: '2026-03-06T09:00:00Z',
  currentLevel: 8,
  totalXp: 2850,
  currentStreak: 5,
  longestStreak: 7,
  lastActiveDate: '2026-03-20T19:30:00Z',

  achievementsUnlocked: [
    'ach-first-correct',    // First Principles
    'ach-first-topic',      // First Steps
    'ach-ten-correct',      // Building Momentum
    'ach-fifty-correct',    // Solid Foundation
    'ach-streak-3',         // Getting Warmed Up
    'ach-streak-7',         // Week Warrior (from the 7-day streak earlier)
    'ach-five-topics',      // Renaissance Engineer
    'ach-perfect-session',  // Flawless Execution (one perfect SOM session)
    'ach-weekend-warrior',  // Weekend Warrior
    'ach-daily-challenge-5',// Challenger
    'ach-topic-master',     // Topic Master (SOM at 85%)
    'ach-bookworm',         // Bookmarked for Later
  ],

  topicProgress: [
    {
      topicId: 'engineering-mechanics',
      questionsAttempted: 12,
      questionsCorrect: 9,
      averageConfidence: 0.72,
      lastAttempted: '2026-03-19T20:15:00Z',
      subtopicBreakdown: {
        'Statics & Equilibrium': { attempted: 4, correct: 4 },
        'Dynamics & Kinematics': { attempted: 3, correct: 2 },
        'Free-Body Diagrams': { attempted: 2, correct: 1 },
        'Work & Energy Methods': { attempted: 3, correct: 2 },
      },
    },
    {
      topicId: 'strength-of-materials',
      questionsAttempted: 18,
      questionsCorrect: 15,
      averageConfidence: 0.85,
      lastAttempted: '2026-03-20T18:45:00Z',
      subtopicBreakdown: {
        'Stress & Strain': { attempted: 5, correct: 5 },
        'Beam Bending': { attempted: 4, correct: 4 },
        'Torsion': { attempted: 3, correct: 2 },
        'Failure Theories': { attempted: 3, correct: 2 },
        'Buckling & Stability': { attempted: 2, correct: 1 },
        'Fatigue & Fracture': { attempted: 1, correct: 1 },
      },
    },
    {
      topicId: 'thermodynamics',
      questionsAttempted: 8,
      questionsCorrect: 4,
      averageConfidence: 0.45,
      lastAttempted: '2026-03-18T21:00:00Z',
      subtopicBreakdown: {
        'Laws of Thermodynamics': { attempted: 3, correct: 2 },
        'Power & Refrigeration Cycles': { attempted: 3, correct: 1 },
        'Properties & State': { attempted: 2, correct: 1 },
      },
    },
    {
      topicId: 'heat-transfer',
      questionsAttempted: 5,
      questionsCorrect: 2,
      averageConfidence: 0.38,
      lastAttempted: '2026-03-17T19:30:00Z',
      subtopicBreakdown: {
        'Conduction': { attempted: 2, correct: 1 },
        'Convection': { attempted: 2, correct: 1 },
        'Heat Exchangers': { attempted: 1, correct: 0 },
      },
    },
    {
      topicId: 'fluid-mechanics',
      questionsAttempted: 10,
      questionsCorrect: 7,
      averageConfidence: 0.65,
      lastAttempted: '2026-03-20T19:15:00Z',
      subtopicBreakdown: {
        'Fluid Statics': { attempted: 2, correct: 2 },
        'Fluid Dynamics': { attempted: 3, correct: 2 },
        'Pipe Flow & Losses': { attempted: 3, correct: 2 },
        'Pumps & Turbomachinery': { attempted: 2, correct: 1 },
      },
    },
    {
      topicId: 'materials-engineering',
      questionsAttempted: 9,
      questionsCorrect: 6,
      averageConfidence: 0.62,
      lastAttempted: '2026-03-19T20:45:00Z',
      subtopicBreakdown: {
        'Metals & Alloys': { attempted: 3, correct: 3 },
        'Polymers & Elastomers': { attempted: 2, correct: 1 },
        'Corrosion & Degradation': { attempted: 2, correct: 1 },
        'Material Selection': { attempted: 2, correct: 1 },
      },
    },
    {
      topicId: 'manufacturing',
      questionsAttempted: 7,
      questionsCorrect: 5,
      averageConfidence: 0.68,
      lastAttempted: '2026-03-18T20:30:00Z',
      subtopicBreakdown: {
        'Machining': { attempted: 2, correct: 2 },
        'Casting & Molding': { attempted: 2, correct: 1 },
        'Welding & Joining': { attempted: 2, correct: 1 },
        'Additive Manufacturing': { attempted: 1, correct: 1 },
      },
    },
    {
      topicId: 'machine-elements',
      questionsAttempted: 14,
      questionsCorrect: 11,
      averageConfidence: 0.78,
      lastAttempted: '2026-03-20T19:30:00Z',
      subtopicBreakdown: {
        'Bearings': { attempted: 4, correct: 3 },
        'Gears & Gear Trains': { attempted: 3, correct: 3 },
        'Fasteners & Joints': { attempted: 4, correct: 3 },
        'Shafts & Couplings': { attempted: 2, correct: 1 },
        'Seals & Gaskets': { attempted: 1, correct: 1 },
      },
    },
    {
      topicId: 'design-tolerancing',
      questionsAttempted: 6,
      questionsCorrect: 4,
      averageConfidence: 0.60,
      lastAttempted: '2026-03-16T21:00:00Z',
      subtopicBreakdown: {
        'GD&T Fundamentals': { attempted: 3, correct: 2 },
        'Fits & Limits': { attempted: 2, correct: 1 },
        'Tolerance Stack-Up': { attempted: 1, correct: 1 },
      },
    },
    {
      topicId: 'vibrations',
      questionsAttempted: 3,
      questionsCorrect: 2,
      averageConfidence: 0.55,
      lastAttempted: '2026-03-15T19:00:00Z',
      subtopicBreakdown: {
        'Free Vibration': { attempted: 2, correct: 2 },
        'Vibration Isolation': { attempted: 1, correct: 0 },
      },
    },
    {
      topicId: 'real-world-mechanisms',
      questionsAttempted: 8,
      questionsCorrect: 6,
      averageConfidence: 0.70,
      lastAttempted: '2026-03-20T18:00:00Z',
      subtopicBreakdown: {
        'Everyday Machines': { attempted: 3, correct: 3 },
        'Automotive Systems': { attempted: 2, correct: 1 },
        'Linkages & Mechanisms': { attempted: 2, correct: 1 },
        'Failure Case Studies': { attempted: 1, correct: 1 },
      },
    },
  ],

  sessionHistory: [
    {
      id: 'sess-001',
      date: '2026-03-06T09:30:00Z',
      durationMinutes: 15,
      questionsAttempted: 8,
      questionsCorrect: 5,
      topicsCovered: ['engineering-mechanics', 'strength-of-materials'],
      xpEarned: 120,
    },
    {
      id: 'sess-002',
      date: '2026-03-07T20:00:00Z',
      durationMinutes: 22,
      questionsAttempted: 10,
      questionsCorrect: 7,
      topicsCovered: ['strength-of-materials', 'machine-elements'],
      xpEarned: 175,
    },
    {
      id: 'sess-003',
      date: '2026-03-08T14:00:00Z',
      durationMinutes: 18,
      questionsAttempted: 9,
      questionsCorrect: 6,
      topicsCovered: ['fluid-mechanics', 'materials-engineering'],
      xpEarned: 145,
    },
    {
      id: 'sess-004',
      date: '2026-03-09T10:30:00Z',
      durationMinutes: 12,
      questionsAttempted: 5,
      questionsCorrect: 5,
      topicsCovered: ['strength-of-materials'],
      xpEarned: 200,  // perfect session bonus
    },
    {
      id: 'sess-005',
      date: '2026-03-10T19:15:00Z',
      durationMinutes: 25,
      questionsAttempted: 12,
      questionsCorrect: 8,
      topicsCovered: ['thermodynamics', 'heat-transfer', 'fluid-mechanics'],
      xpEarned: 180,
    },
    {
      id: 'sess-006',
      date: '2026-03-11T20:30:00Z',
      durationMinutes: 20,
      questionsAttempted: 10,
      questionsCorrect: 7,
      topicsCovered: ['manufacturing', 'design-tolerancing'],
      xpEarned: 165,
    },
    {
      id: 'sess-007',
      date: '2026-03-12T21:00:00Z',
      durationMinutes: 15,
      questionsAttempted: 7,
      questionsCorrect: 5,
      topicsCovered: ['machine-elements', 'vibrations'],
      xpEarned: 130,
    },
    // Streak broken here (March 13 missed)
    {
      id: 'sess-008',
      date: '2026-03-14T19:00:00Z',
      durationMinutes: 18,
      questionsAttempted: 8,
      questionsCorrect: 5,
      topicsCovered: ['thermodynamics', 'real-world-mechanisms'],
      xpEarned: 140,
    },
    {
      id: 'sess-009',
      date: '2026-03-15T15:30:00Z',
      durationMinutes: 20,
      questionsAttempted: 10,
      questionsCorrect: 7,
      topicsCovered: ['vibrations', 'engineering-mechanics', 'real-world-mechanisms'],
      xpEarned: 165,
    },
    // Current streak starts March 16
    {
      id: 'sess-010',
      date: '2026-03-16T19:00:00Z',
      durationMinutes: 22,
      questionsAttempted: 11,
      questionsCorrect: 8,
      topicsCovered: ['design-tolerancing', 'machine-elements', 'strength-of-materials'],
      xpEarned: 190,
    },
    {
      id: 'sess-011',
      date: '2026-03-17T20:15:00Z',
      durationMinutes: 17,
      questionsAttempted: 8,
      questionsCorrect: 5,
      topicsCovered: ['heat-transfer', 'thermodynamics'],
      xpEarned: 130,
    },
    {
      id: 'sess-012',
      date: '2026-03-18T20:30:00Z',
      durationMinutes: 25,
      questionsAttempted: 12,
      questionsCorrect: 9,
      topicsCovered: ['manufacturing', 'materials-engineering', 'thermodynamics'],
      xpEarned: 205,
    },
    {
      id: 'sess-013',
      date: '2026-03-19T20:15:00Z',
      durationMinutes: 20,
      questionsAttempted: 10,
      questionsCorrect: 8,
      topicsCovered: ['engineering-mechanics', 'materials-engineering', 'machine-elements'],
      xpEarned: 190,
    },
    {
      id: 'sess-014',
      date: '2026-03-20T18:00:00Z',
      durationMinutes: 30,
      questionsAttempted: 14,
      questionsCorrect: 10,
      topicsCovered: ['strength-of-materials', 'fluid-mechanics', 'machine-elements', 'real-world-mechanisms'],
      xpEarned: 235,
    },
  ],

  dailyChallengesCompleted: 7,
  totalQuestionsAttempted: 100,
  totalQuestionsCorrect: 71,

  bookmarkedQuestions: [
    'som-003',    // Shaft failure — wants to revisit fatigue
    'som-005',    // Shaft failure scenario — complex
    'thermo-002', // Cycle efficiency ranking — got it wrong
    'thermo-003', // Heat pump tradeoff — needs to review COP
    'ht-003',     // Heat exchanger design — wants to study
    'fm-002',     // Pipe flow estimation — practice the calculation
    'mat-003',    // Dissimilar metals scenario — galvanic series
    'me-004',     // Bolt stiffness ratio — key concept
    'dt-002',     // Tolerance stack-up estimation
    'vib-003',    // Vibration isolation — got it wrong
  ],

  weakAreas: [
    'thermodynamics',
    'heat-transfer',
  ],

  strongAreas: [
    'strength-of-materials',
    'machine-elements',
  ],
};
