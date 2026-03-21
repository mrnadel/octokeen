'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'mechready-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-200 bg-white shadow-lg"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4">
            <div className="flex items-center gap-3 text-sm text-surface-600">
              <Cookie className="hidden h-5 w-5 flex-shrink-0 text-surface-400 sm:block" />
              <p>
                We use essential cookies to keep you signed in and remember your
                progress. No tracking cookies.{' '}
                <Link
                  href="/privacy"
                  className="text-primary-600 underline hover:text-primary-700"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
            <button
              onClick={handleAccept}
              className="flex-shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
