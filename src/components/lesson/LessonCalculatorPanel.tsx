'use client';

import { motion, AnimatePresence } from 'framer-motion';
import EngineeringCalculator from '@/components/calculator/EngineeringCalculator';
import FinanceCalculators from '@/components/calculator/FinanceCalculators';
import { useLessonColors } from '@/lib/lessonColors';
import { PROFESSION_ID } from '@/data/professions';

interface LessonCalculatorPanelProps {
  isOpen: boolean;
  profession: string | null;
  onClose: () => void;
  unitColor: string;
  accentDark: string;
}

export function LessonCalculatorPanel({
  isOpen,
  profession,
  onClose,
  unitColor,
  accentDark,
}: LessonCalculatorPanelProps) {
  const c = useLessonColors();

  return (
    <AnimatePresence>
      {isOpen && profession === PROFESSION_ID.MECHANICAL_ENGINEERING && (
        <EngineeringCalculator
          isOpen={isOpen}
          onClose={onClose}
          accentColor={unitColor}
          accentDark={accentDark}
        />
      )}
      {isOpen && profession === PROFESSION_ID.PERSONAL_FINANCE && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '65vh',
            overflowY: 'auto',
            background: c.cardBg,
            borderTop: `3px solid ${unitColor}`,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            zIndex: 50,
            paddingTop: 16,
          }}
        >
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: c.closeBtnStroke }}
            aria-label="Close calculator"
          >
            &times;
          </button>
          <FinanceCalculators />
        </motion.div>
      )}
      {isOpen && profession === PROFESSION_ID.SPACE_ASTRONOMY && (
        <EngineeringCalculator
          isOpen={isOpen}
          onClose={onClose}
          accentColor={unitColor}
          accentDark={accentDark}
        />
      )}
    </AnimatePresence>
  );
}
