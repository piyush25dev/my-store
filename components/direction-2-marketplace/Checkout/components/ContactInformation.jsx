"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Users, Info } from "lucide-react";

export default function ContactInformation({ formData, onFormChange, errors }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                1
              </span>
            </div>
            <h3 className="font-semibold">
              Contact Information
            </h3>
          </div>

          <Badge
            variant="outline"
            className="gap-1 w-fit"
          >
            <Users className="w-3 h-3" />
            Required
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onFormChange}
              className={errors.email ? "border-red-500" : ""}
            />

            {errors.email ? (
              <p className="text-sm text-red-500">
                {errors.email}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Order confirmation and product access will be sent here
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>

            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={onFormChange}
              className={errors.phone ? "border-red-500" : ""}
            />

            {errors.phone ? (
              <p className="text-sm text-red-500">
                {errors.phone}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                For delivery updates and support
              </p>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>

          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={onFormChange}
            className={errors.name ? "border-red-500" : ""}
          />

          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 text-blue-600" />
          <AlertDescription className="text-sm">
            We&apos;ll use this information to send your order
            confirmation and product access details.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
