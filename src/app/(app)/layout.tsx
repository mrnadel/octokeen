'use client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="max-w-lg mx-auto min-h-screen">
        {children}
      </div>
    </div>
  );
}
