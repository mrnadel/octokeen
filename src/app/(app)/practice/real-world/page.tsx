'use client';

import { useSession, useSessionActions } from '@/store/useStore';
import SessionView from '@/components/session/SessionView';
import { Wrench } from 'lucide-react';

export default function RealWorldPage() {
  const { session, sessionSummary } = useSession();
  const { startSession } = useSessionActions();

  if (session || sessionSummary) {
    return <SessionView />;
  }

  const examples = [
    'Door closers & hydraulic dampers',
    'Bicycle drivetrains & braking',
    'Refrigeration cycles',
    'Automotive suspension & shock absorbers',
    'Pressure cookers & safety valves',
    'Elevators & counterweights',
    'Hand tools & mechanical advantage',
    'Pumps, valves & faucets',
  ];

  return (
    <div className="max-w-2xl mx-auto text-center px-4 sm:px-0 py-8 sm:py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-100 mb-4 sm:mb-6">
        <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-surface-600" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-surface-900 mb-3">Real-World Systems</h1>
      <p className="text-surface-500 mb-6 sm:mb-8 max-w-md mx-auto">
        Connect engineering theory to everyday mechanisms.
        Interviewers love candidates who can explain how real things work.
      </p>

      <div className="card p-4 sm:p-6 mb-6 sm:mb-8 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-surface-800 mb-3">Topics covered:</h3>
        <div className="grid grid-cols-1 gap-2">
          {examples.map((ex, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-surface-600">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-400 shrink-0" />
              {ex}
            </div>
          ))}
        </div>
      </div>


      <button
        onClick={() => startSession('real-world')}
        className="btn-primary text-base sm:text-lg py-3 px-6 sm:px-8 w-full sm:w-auto bg-surface-700 hover:bg-surface-800"
      >
        Explore Real-World Systems
      </button>
    </div>
  );
}
