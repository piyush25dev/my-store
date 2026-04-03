import CheckoutIndex from "@/components/direction-3-premium/Checkout/CheckoutIndex";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense fallback={null}>
        <CheckoutIndex />
      </Suspense>
    </div>
  );
}
