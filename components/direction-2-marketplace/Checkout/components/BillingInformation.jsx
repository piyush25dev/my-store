"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function BillingInformation({ formData, onFormChange, errors }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                2
              </span>
            </div>
            <h3 className="font-semibold">
              Billing Information
            </h3>
          </div>

          {/* Same as Shipping */}
          <div className="flex items-center gap-2">
            <Checkbox id="same-as-shipping" />
            <Label
              htmlFor="same-as-shipping"
              className="text-sm cursor-pointer"
            >
              Same as shipping address
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Address + City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main Street, Apt 4B"
              value={formData.address}
              onChange={onFormChange}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">
                {errors.address}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={onFormChange}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500">
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* State / PIN / Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">
              State <span className="text-red-500">*</span>
            </Label>
            <Input
              id="state"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={onFormChange}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-sm text-red-500">
                {errors.state}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">
              PIN Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="560001"
              value={formData.pincode}
              onChange={onFormChange}
              className={errors.pincode ? "border-red-500" : ""}
            />
            {errors.pincode && (
              <p className="text-sm text-red-500">
                {errors.pincode}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">
              Country <span className="text-red-500">*</span>
            </Label>
            <Input
              id="country"
              name="country"
              placeholder="India"
              value={formData.country}
              onChange={onFormChange}
              className={errors.country ? "border-red-500" : ""}
            />
            {errors.country && (
              <p className="text-sm text-red-500">
                {errors.country}
              </p>
            )}
          </div>
        </div>

        {/* Billing Type */}
        <div className="space-y-3">
          <Label>Billing Type</Label>

          <RadioGroup
            defaultValue="personal"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <label
              htmlFor="personal"
              className="flex items-start gap-3 border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
            >
              <RadioGroupItem value="personal" id="personal" />
              <div>
                <div className="font-medium">Personal</div>
                <div className="text-sm text-gray-500">
                  For personal use
                </div>
              </div>
            </label>

            <label
              htmlFor="business"
              className="flex items-start gap-3 border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
            >
              <RadioGroupItem value="business" id="business" />
              <div>
                <div className="font-medium">Business</div>
                <div className="text-sm text-gray-500">
                  With GST invoice
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
