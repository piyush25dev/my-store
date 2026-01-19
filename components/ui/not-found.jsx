import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProductNotFound({ backUrl }) {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href={backUrl}>
            <Button>Back to Store</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}