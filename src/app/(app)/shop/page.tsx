'use client';

import { GemShop } from '@/components/engagement/GemShop';
import { GemCounter } from '@/components/engagement/GemCounter';

export default function ShopPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Gem Shop</h1>
        {/* Show current gem balance */}
        <GemCounter />
      </div>
      <GemShop />
    </div>
  );
}
