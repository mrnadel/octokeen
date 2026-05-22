// src/components/calculator/FinanceCalculators.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompoundInterestCalc } from './CompoundInterestCalc';
import { LoanPayoffCalc } from './LoanPayoffCalc';
import { BudgetCalc } from './BudgetCalc';

// ── Types ──

type TabId = 'compound' | 'loan' | 'budget';

interface TabDef {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: TabDef[] = [
  { id: 'compound', label: 'Compound Interest', icon: '📈' },
  { id: 'loan', label: 'Loan Payoff', icon: '🏦' },
  { id: 'budget', label: 'Budget 50/30/20', icon: '💰' },
];

// ── Main component ──

export default function FinanceCalculators() {
  const [activeTab, setActiveTab] = useState<TabId>('compound');

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 32px' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 4,
        background: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#1E293B' : '#94A3B8',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 15 }}>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Calculator content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'compound' && <CompoundInterestCalc />}
          {activeTab === 'loan' && <LoanPayoffCalc />}
          {activeTab === 'budget' && <BudgetCalc />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
