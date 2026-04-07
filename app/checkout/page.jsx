import CheckoutIndex from "@/components/direction-3-premium/Checkout/CheckoutIndex";
import LoadingState from "@/components/direction-3-premium/Checkout/LoadingState";
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
