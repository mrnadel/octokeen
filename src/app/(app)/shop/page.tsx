'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GemShop } from '@/components/engagement/GemShop';

export default function ShopPage() {
  const router = useRouter();

  return (
    <>
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="p-3 -ml-3 rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900 ml-2">Gem Shop</h1>
        </div>
      </div>
      <div className="px-4 sm:px-5 py-5 sm:py-6">
        <GemShop />
      </div>
    </>
  );
}
