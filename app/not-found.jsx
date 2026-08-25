// app/not-found.jsx
"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center px-4 bg-gradient-to-br from-rose-400 to-pink-500">
      <Card className="max-w-md w-full text-center shadow-2xl shadow-rose-500/30 border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pt-8">
          <div className="flex justify-center mb-2">
            <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
              404
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-8">
          <Button 
            asChild 
            className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}