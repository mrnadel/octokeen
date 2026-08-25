'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '@/hooks/useScrollLock';
import { X, ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';
import { MascotWithGlow } from '@/components/ui/MascotWithGlow';
import { useCourseStore } from '@/store/useCourseStore';
import { getProfession } from '@/data/professions';
import { analytics } from '@/lib/mixpanel';
import {
  type ExperienceLevel,
  type PlacementChoice,
  type GoalChoice,
  type CommitmentChoice,
} from '@/data/course-intro-options';
import type { CourseIntroData } from '@/data/course/types';
import { StepExperience, StepPlacement, StepGoal, StepCommitment, StepLaunch } from './CourseIntroSteps';

// ── Main component ───────────────────────────────────────────

interface CourseIntroFlowProps {
  onComplete: (data: CourseIntroData) => void;
  onDismiss: () => void;
}

export function CourseIntroFlow({ onComplete, onDismiss }: CourseIntroFlowProps) {
  useScrollLock(true);
  const activeProfession = useCourseStore((s) => s.activeProfession);
  const profession = getProfession(activeProfession);
  const professionName = profession?.name ?? 'this course';
  const accent = profession?.color ?? '#3B82F6';

  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [placement, setPlacement] = useState<PlacementChoice | null>(null);
  const [goal, setGoal] = useState<GoalChoice | null>(null);
  const [commitment, setCommitment] = useState<CommitmentChoice | null>(null);

  const skipPlacement = experience === 0;

  // Map visual step index to logical step index, skipping placement when needed.
  // 0=experience, 1=placement, 2=goal, 3=commitment, 4=launch
  // Placement is auto-skipped when experience === 0.
  const getLogicalStep = (s: number) => {
    let logical = s;
    if (skipPlacement && logical >= 1) logical += 1;
    return logical;
  };
  const logicalStep = getLogicalStep(step);

  // Total visual steps (what the user sees)
  const baseSteps = 5; // experience + placement + goal + commitment + launch
  const totalSteps = skipPlacement ? baseSteps - 1 : baseSteps;

  const canContinue = () => {
    switch (logicalStep) {
      case 0: return experience !== null;
      case 1: return placement !== null;
      case 2: return goal !== null;
      case 3: return commitment !== null;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = useCallback(() => {
    if (logicalStep === 0 && experience === 0) {
      setPlacement('scratch');
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      const data: CourseIntroData = {
        experienceLevel: experience!,
        placementChoice: placement ?? 'scratch',
        goal: goal!,
        dailyMinutes: commitment!,
        completedAt: new Date().toISOString(),
      };
      analytics.milestone({ type: 'course_intro_completed', name: `intro_${activeProfession}`, value: 1 });
      onComplete(data);
    }
  }, [step, totalSteps, logicalStep, experience, placement, goal, commitment, activeProfession, onComplete]);

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const mascotConfig = [
    { pose: 'excited' as const, bubble: `How much ${professionName} do you know?` },
    { pose: 'thinking' as const, bubble: "Let's find the right starting point!" },
    { pose: 'proud' as const, bubble: "What's driving you?" },
    { pose: 'winking' as const, bubble: 'How often will you practice?' },
    { pose: 'celebrating' as const, bubble: "You're all set! Let's go!" },
  ];
  const launchLogical = 4;
  const mascot = mascotConfig[logicalStep] ?? mascotConfig[0];
  const launchText = placement === 'test' ? 'Take Placement Test' : 'Start Learning';
  const enabled = canContinue();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Full-screen panel, same bg as app body */}
        <motion.div
          className="w-full h-full sm:h-auto sm:max-w-sm sm:rounded-3xl sm:shadow-2xl overflow-hidden flex flex-col relative"
          style={{ backgroundColor: '#FAFAFA' }}
          role="dialog"
          aria-modal="true"
          aria-label="Course introduction"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Top bar: back + progress + close */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-1">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-full hover:bg-surface-100 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-surface-400" />
              </button>
            ) : (
              <div className="w-9" />
            )}

            <div className="flex-1 h-2.5 bg-surface-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: accent }}
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            <button
              onClick={onDismiss}
              className="w-9 h-9 rounded-full hover:bg-surface-100 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-surface-400" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 flex flex-col justify-center sm:flex-initial overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-4"
              >
                {/* Mascot centered with speech bubble below */}
                <div className="text-center mb-5">
                  <motion.div
                    initial={{ scale: 0.6, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="inline-block"
                  >
                    <MascotWithGlow pose={mascot.pose} size={96} />
                  </motion.div>
                  <div
                    className="inline-block mt-2 px-5 py-2.5 rounded-2xl relative"
                    style={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                  >
                    {/* Little triangle pointing up */}
                    <div
                      className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                      style={{ backgroundColor: 'white', borderLeft: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0' }}
                    />
                    <p className="text-sm font-bold text-surface-800 relative">{mascot.bubble}</p>
                  </div>
                </div>

                {/* Step content */}
                {logicalStep === 0 && (
                  <StepExperience selected={experience} onSelect={setExperience} accent={accent} />
                )}
                {logicalStep === 1 && (
                  <StepPlacement selected={placement} onSelect={setPlacement} experience={experience!} accent={accent} />
                )}
                {logicalStep === 2 && (
                  <StepGoal selected={goal} onSelect={setGoal} accent={accent} />
                )}
                {logicalStep === 3 && (
                  <StepCommitment selected={commitment} onSelect={setCommitment} accent={accent} />
                )}
                {logicalStep === launchLogical && (
                  <StepLaunch professionName={professionName} commitment={commitment!} placement={placement!} accent={accent} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          <div className="shrink-0 px-6 pb-8 sm:pb-5">
            <motion.button
              onClick={handleNext}
              disabled={!enabled}
              whileTap={enabled ? { y: 4, boxShadow: '0 0 0 transparent', transition: { duration: 0.06 } } : undefined}
              className="w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 select-none"
              style={{
                backgroundColor: enabled ? accent : '#E2E8F0',
                boxShadow: enabled ? `0 4px 0 color-mix(in srgb, ${accent} 70%, #000)` : '0 4px 0 #CBD5E1',
                color: enabled ? '#fff' : '#94A3B8',
              }}
            >
              {logicalStep === launchLogical ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  {launchText}
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
