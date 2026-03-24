import type { Unit } from '../../types';

export const financeCourseMeta: Unit[] = [
  {
    id: 'pf-u1-budgeting',
    title: 'Budgeting Basics',
    description: 'Income, expenses, the 50/30/20 rule, and building your first emergency fund.',
    color: '#10B981',
    icon: '💰',
    lessons: [
      { id: 'pf-u1-L1', title: 'Income & Expenses', description: 'Understand gross vs net income, fixed vs variable expenses, and how to track your money.', icon: '💵', xpReward: 20, questions: [] },
      { id: 'pf-u1-L2', title: 'The 50/30/20 Rule', description: 'Learn the most popular budgeting framework: 50% needs, 30% wants, 20% savings.', icon: '📊', xpReward: 20, questions: [] },
      { id: 'pf-u1-L3', title: 'Emergency Funds', description: 'Why you need 3-6 months of expenses saved, and how to build it.', icon: '🛡️', xpReward: 25, questions: [] },
    ],
  },
];
