import Link from 'next/link';

const GEAR_PATH =
  'M60 10l6 14a36 36 0 0110.4 4.3l14.6-3.8 5.5 9.5-8.6 12a36 36 0 014.3 10.4L106 60l-3.5 10-14.6-3.8a36 36 0 01-4.3 10.4l8.6 12-9.5 5.5-12-8.6a36 36 0 01-10.4 4.3L60 110l-10-3.5 3.8-14.6a36 36 0 01-10.4-4.3l-12 8.6-5.5-9.5 8.6-12A36 36 0 0130.2 64.3L14 60l3.5-10 14.6 3.8a36 36 0 014.3-10.4l-8.6-12 9.5-5.5 12 8.6A36 36 0 0159.7 30.2L60 10z';

export interface NotFoundScreenProps {
  /** Body copy explaining the miss — varies per route group. */
  description: string;
  /** Tailwind size class for the gear illustration, e.g. `w-28 h-28`. */
  gearSizeClass: string;
  /** Tailwind text size class for the "404" overlay, e.g. `text-3xl`. */
  labelSizeClass: string;
}

/** Shared 404 screen: gear illustration, heading, description and two escape hatches. */
export function NotFoundScreen({ description, gearSizeClass, labelSizeClass }: NotFoundScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className={`relative ${gearSizeClass}`}>
            <svg viewBox="0 0 120 120" className="w-full h-full text-primary-200">
              <path fill="currentColor" d={GEAR_PATH} />
              <circle cx="60" cy="60" r="20" fill="#FAFAFA" />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center ${labelSizeClass} font-black text-primary-600`}
            >
              404
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-black text-surface-900 mb-2">Page Not Found</h1>
        <p className="text-surface-500 mb-8 leading-relaxed">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Back to Dashboard
          </Link>
          <Link href="/course" className="btn-secondary">
            Course Map
          </Link>
        </div>
      </div>
    </div>
  );
}
