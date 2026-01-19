"use client";

import CheckoutMinimal from '@/components/direction-1-minimal/checkout';
import { Suspense } from 'react';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutMinimal />
    </Suspense>
  );
}