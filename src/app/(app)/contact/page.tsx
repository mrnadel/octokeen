'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Settings > Billing to manage or cancel your subscription. You can also contact us at support@mechready.com and we\'ll take care of it for you.',
  },
  {
    question: 'I forgot my password',
    answer:
      'Use the "Forgot password" link on the login page to reset it. If you\'re still having trouble, reach out to support@mechready.com for help.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Please contact us at support@mechready.com and we\'ll process your account deletion request.',
  },
  {
    question: 'I found incorrect content',
    answer:
      'Use the flag button on any question to report it directly. You can also email support@mechready.com with details about the issue.',
  },
  {
    question: "I'm not receiving emails",
    answer:
      'Check your spam or junk folder first. If emails still aren\'t arriving, contact support@mechready.com and we\'ll look into it.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left"
    >
      <div className="flex items-center justify-between py-3">
        <span className="text-sm font-medium text-surface-800 pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-surface-400 shrink-0 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </div>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          open ? 'max-h-40 pb-3' : 'max-h-0'
        )}
      >
        <p className="text-sm text-surface-500 leading-relaxed">{answer}</p>
      </div>
    </button>
  );
}

export default function ContactPage() {
  return (
    <div className="pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center h-14 px-4">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 ml-2">Contact & Support</h1>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6 max-w-2xl mx-auto">
        {/* Support Email Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-surface-900">Email Support</h2>
              <p className="text-xs text-surface-500">Our primary support channel</p>
            </div>
          </div>
          <a
            href="mailto:support@mechready.com"
            className="block w-full py-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold text-sm transition-colors text-center"
          >
            support@mechready.com
          </a>
          <div className="flex items-center gap-2 mt-3">
            <MessageCircle className="w-3.5 h-3.5 text-surface-400" />
            <p className="text-xs text-surface-500">
              We typically respond within 24 hours
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-surface-900">Common Questions</h2>
              <p className="text-xs text-surface-500">Quick answers to frequent topics</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
