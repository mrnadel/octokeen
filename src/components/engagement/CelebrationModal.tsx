'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
import { ShareButton } from '@/components/ui/ShareButton';
import { GameButton, type GameButtonVariant } from '@/components/ui/GameButton';
import { getShareCardUrl, getShareText, getDisplayName } from '@/lib/share-card';
import type { ShareCardType } from '@/lib/share-card';
import type { FXName } from '@/components/ui/ScreenFX';

/** Reusable spring preset for celebration content entrance animations. */
export const celebrationSpring = { type: 'spring' as const, stiffness: 300, damping: 15 };

interface CelebrationModalProps {
  onClose: () => void;
  fx?: FXName;
  bg?: string;
  /** Milliseconds before dismiss is enabled (default 0 = instant). */
  dismissDelay?: number;
  /** When provided, renders a ShareButton above the continue button. */
  shareData?: { type: ShareCardType; value: string | number; fileName?: string };
  /** Custom footer content. When omitted, renders the default Continue button. */
  footer?: ReactNode;
  /** Button label (default "Continue"). Ignored when custom footer is provided. */
  buttonLabel?: string;
  /** GameButton variant (default "gold"). Ignored when custom footer is provided. */
  buttonVariant?: GameButtonVariant;
  /** aria-labelledby target */
  labelId?: string;
  children: ReactNode;
}

export function CelebrationModal({
  onClose,
  fx,
  bg = '#58A700',
  dismissDelay = 0,
  shareData,
  footer,
  buttonLabel = 'Continue',
  buttonVariant = 'gold',
  labelId,
  children,
}: CelebrationModalProps) {
  const [canDismiss, setCanDismiss] = useState(dismissDelay === 0);

  useEffect(() => {
    if (dismissDelay <= 0) return;
    const t = setTimeout(() => setCanDismiss(true), dismissDelay);
    return () => clearTimeout(t);
  }, [dismissDelay]);

  const handleDismiss = useCallback(() => {
    if (canDismiss) onClose();
  }, [canDismiss, onClose]);

  const defaultFooter = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: canDismiss ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      {shareData && (
        <div className="flex justify-center">
          <ShareButton
            imageUrl={getShareCardUrl(shareData.type, shareData.value, getDisplayName())}
            shareText={getShareText(shareData.type, shareData.value)}
            fileName={shareData.fileName ?? `octokeen-${shareData.type}-${shareData.value}.png`}
          />
        </div>
      )}
      <GameButton variant={buttonVariant} onClick={handleDismiss}>
        {buttonLabel}
      </GameButton>
    </motion.div>
  );

  return (
    <FullScreenModal
      show
      bg={bg}
      fx={fx}
      labelId={labelId}
      footer={footer ?? defaultFooter}
    >
      {children}
    </FullScreenModal>
  );
}
