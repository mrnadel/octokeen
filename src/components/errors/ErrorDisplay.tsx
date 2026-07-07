import Link from 'next/link';

interface ErrorDisplayProps {
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  description: string;
  backHref: string;
  backLabel?: string;
  onRetry: () => void;
}

export default function ErrorDisplay({
  icon,
  iconBgClass,
  iconColorClass,
  title,
  description,
  backHref,
  backLabel = 'Go Back',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div
            className={`w-20 h-20 rounded-full ${iconBgClass} flex items-center justify-center`}
          >
            <div className={`w-10 h-10 ${iconColorClass}`}>{icon}</div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-surface-900 mb-2">{title}</h1>
        <p className="text-surface-500 mb-8 leading-relaxed">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onRetry} className="btn-primary">
            Try Again
          </button>
          <Link href={backHref} className="btn-secondary">
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
