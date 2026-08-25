import React from 'react';
import { interpolate } from 'remotion';
import { C } from '../theme';

/**
 * The lesson header: close button plus the segmented progress bar.
 * `progress` is how far through the pip row the fill has travelled,
 * expressed in pips (2.4 means two full pips and a partial third).
 */
export const ProgressPips: React.FC<{ count?: number; progress: number }> = ({
  count = 8,
  progress,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '44px 40px 34px',
      borderBottom: `3px solid ${C.surface200}`,
    }}
  >
    <div
      style={{
        width: 68,
        height: 68,
        borderRadius: 18,
        background: C.surface100,
        color: C.surface400,
        fontSize: 40,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      ×
    </div>
    <div style={{ display: 'flex', gap: 12, flex: 1 }}>
      {new Array(count).fill(0).map((_, i) => {
        const fill = interpolate(progress, [i, i + 1], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 18,
              borderRadius: 999,
              background: C.surface200,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: '100%',
                borderRadius: 999,
                background: C.macaw,
              }}
            />
          </div>
        );
      })}
    </div>
  </div>
);
