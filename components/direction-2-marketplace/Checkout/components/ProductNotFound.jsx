import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
            <p className="text-gray-600">
              The product you&apos;re trying to purchase is no longer available or doesn&apos;t exist.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/mockups/direction-2-marketplace/store">
              Browse Marketplace
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}