
"use client";

import { Suspense } from "react";
import LoadingState from "@/components/direction-2-marketplace/Checkout/components/LoadingState";
import CheckoutIndex from "@/components/direction-2-marketplace/Checkout/CheckoutIndex";

export default function CheckoutMarketplacePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutIndex />
    </Suspense>
  );
}