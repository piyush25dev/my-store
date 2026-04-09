// app/auth/login/page.jsx - UPDATED for your profiles table
// Works with your actual table structure

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

// shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithOAuth, loading, error: authError, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // If user is already authenticated, redirect to their dashboard
      if (user) {
        try {
          // Fetch user profile to get their role
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("user_role")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            
            // If profile doesn't exist, create one with default values
            if (profileError.code === "PGRST116" || profileError.code === "406") {
              console.log("Profile not found, creating default profile...");
              const { error: createError } = await supabase.from("profiles").insert({
                id: user.id,
                display_name: user.email?.split("@")[0] || "User",
                user_role: "creator",
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
              
              if (createError) {
                console.error("Failed to create profile:", createError);
              }
              
              router.replace("/dashboard/creator/overview");
              return;
            }
            
            // Other errors - default to creator dashboard
            router.replace("/dashboard/creator/overview");
            return;
          }

          const role = profileData?.user_role || "creator";
          router.replace(`/dashboard/${role}/overview`);
        } catch (err) {
          console.error("Error checking auth:", err);
          // Default to creator dashboard on error
          router.replace("/dashboard/creator/overview");
        }
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuthAndRedirect();
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLocalLoading(true);
    try {
      const { error, user } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error || "Failed to sign in");
        setLocalLoading(false);
        return;
      }

      // ✅ Fetch profile with better error handling
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        
        // If profile doesn't exist, create one
        if (profileError.code === "PGRST116" || profileError.code === "406") {
          console.log("Creating profile for user:", user.id);
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            display_name: user.email?.split("@")[0] || "User",
            user_role: "creator",
            is_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
          if (insertError) {
            console.error("Profile creation error:", insertError);
          }
          
          router.push("/dashboard/creator/overview");
          return;
        }
        
        // For other errors, default to creator
        router.push("/dashboard/creator/overview");
        return;
      }

      const role = profileData?.user_role || "creator";
      router.push(`/dashboard/${role}/overview`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
      setLocalLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setLocalLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setError(`Failed to sign in with ${provider}`);
      }
      // OAuth will redirect automatically via Supabase callback
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Creator Studio account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Error Message */}
          {(error || authError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || authError}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}