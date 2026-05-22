'use client';

import { motion } from 'framer-motion';
import { useIsDark } from '@/store/useThemeStore';
import { PROFESSIONS } from '@/data/professions';
import { CourseIcon } from '@/components/course/CourseIcon';

export function CoursePopoverContent({ activeProfession, grantedCourses, onSelect }: { activeProfession: string; grantedCourses?: string[]; onSelect: (id: string) => void }) {
  const isDark = useIsDark();
  const visibleProfessions = PROFESSIONS.filter(p => !p.requiresAccess || (grantedCourses && grantedCourses.includes(p.id)));
  return (
    <div>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', lineHeight: 1.2 }}>
          My Courses
        </h3>
        <p style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#64748B' : '#AFAFAF', marginTop: 2 }}>
          Choose what to practice
        </p>
      </div>

      {/* Course list */}
      <div style={{ padding: '0 10px 10px' }}>
        {visibleProfessions.map((p, i) => {
          const isActive = activeProfession === p.id;
          const isDisabled = p.isComingSoon === true;

          return (
            <motion.button
              key={p.id}
              onClick={() => !isDisabled && onSelect(p.id)}
              disabled={isDisabled}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              className="w-full text-left transition-all"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: isActive ? `${p.color}${isDark ? '20' : '10'}` : 'transparent',
                border: isActive ? `1.5px solid ${p.color}${isDark ? '40' : '30'}` : '1.5px solid transparent',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.45 : 1,
                marginBottom: i < visibleProfessions.length - 1 ? 4 : 0,
              }}
              whileHover={isDisabled ? undefined : { backgroundColor: isActive ? undefined : (isDark ? '#334155' : '#F7F7F7') }}
              whileTap={isDisabled ? undefined : { scale: 0.98 }}
            >
              {/* Icon */}
              <span
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CourseIcon professionId={p.id} color={p.color} size={40} />
              </span>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#E2E8F0' : '#3C3C3C', lineHeight: 1.2 }}>
                  {p.name}
                </div>
              </div>

              {/* Active indicator / Coming Soon */}
              {isDisabled ? (
                <span style={{
                  fontSize: 9,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: isDark ? '#64748B' : '#AFAFAF',
                  background: isDark ? '#334155' : '#F0F0F0',
                  padding: '3px 7px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                }}>
                  Soon
                </span>
              ) : isActive ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
