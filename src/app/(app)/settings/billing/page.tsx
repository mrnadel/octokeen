'use client';

import { useState } from 'react';
import { ArrowLeft, Check, X, Bell, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { TIERS, FEATURES, type Feature } from '@/lib/pricing';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const FEATURE_LABELS: Record<Feature, string> = {
  [FEATURES.UNIT_ACCESS_ALL]: 'All course units',
  [FEATURES.UNLIMITED_PRACTICE]: 'Unlimited daily practice',
  [FEATURES.ALL_PRACTICE_MODES]: 'All practice modes',
  [FEATURES.FULL_ANALYTICS]: 'Full analytics dashboard',
  [FEATURES.STREAK_FREEZE]: 'Weekly streak freeze',
  [FEATURES.INTERVIEW_READINESS]: 'Interview readiness score',
  [FEATURES.DETAILED_EXPLANATIONS]: 'Detailed explanations',
  [FEATURES.TEAM_DASHBOARD]: 'Team dashboard',
  [FEATURES.TEAM_PROGRESS]: 'Team progress tracking',
  [FEATURES.CUSTOM_QUESTION_SETS]: 'Custom question sets',
  [FEATURES.BULK_LICENSING]: 'Bulk licensing',
};

export default function BillingSettingsPage() {
  const { tier } = useSubscription();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const tierDef = TIERS[tier];

  const handleWaitlistSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center h-14 px-4">
          <Link
            href="/profile"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 ml-2">Billing</h1>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Current Plan Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Current Plan</p>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">{tierDef.name}</h2>
              <p className="text-sm text-gray-500">{tierDef.tagline}</p>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              Free
            </div>
          </div>

          <Link
            href="/pricing"
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            View All Plans
          </Link>
        </div>

        {/* Pro Coming Soon */}
        <div className="bg-white rounded-2xl border border-primary-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Pro launching soon
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Get notified when Pro launches and unlock early access pricing.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">You&apos;re on the list!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleWaitlistSubmit()}
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-200',
                  error ? 'border-red-300' : 'border-gray-200 focus:border-primary-400'
                )}
              />
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <button
                onClick={handleWaitlistSubmit}
                disabled={loading || !email.trim()}
                className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-md shadow-primary-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                Notify me when Pro launches
              </button>
            </div>
          )}
        </div>

        {/* What's included in Pro */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            See what you&apos;ll get with Pro
          </h3>
          <div className="space-y-2.5">
            {TIERS.pro.features.map((feature) => {
              const hasFree = TIERS.free.features.includes(feature);
              return (
                <div key={feature} className="flex items-center gap-2.5">
                  {hasFree ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                  <span className={cn(
                    'text-sm',
                    hasFree ? 'text-gray-700' : 'text-gray-400'
                  )}>
                    {FEATURE_LABELS[feature]}
                  </span>
                  {!hasFree && (
                    <span className="text-xs bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded font-medium ml-auto">
                      Pro
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
