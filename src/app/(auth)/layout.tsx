import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col px-6 pt-4 pb-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-surface-300 hover:text-surface-500 transition-colors w-fit"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center mt-8 mb-10">
          <div
            className="w-20 h-20 bg-white rounded-[20px] flex items-center justify-center mb-4"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <span className="text-4xl leading-none">&#x2699;&#xFE0F;</span>
          </div>
          <h1 className="text-xl font-black text-surface-900">MechReady</h1>
        </div>

        {/* Page content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
