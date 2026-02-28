import LoadingState from "@/components/direction-2-marketplace/Checkout/components/LoadingState";
import CheckoutIndex from "@/components/direction-3-premium/Checkout/CheckoutIndex";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense fallback={<LoadingState />}>
        <CheckoutIndex />
      </Suspense>
    </div>
  );
}
