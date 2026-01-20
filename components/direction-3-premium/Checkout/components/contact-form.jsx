import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm({ formData, setFormData }) {
  return (
    <Card className="border border-gray-200/50 bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          Contact & Shipping
        </h2>
        <p className="text-sm text-gray-600">
          Enter your details for order processing
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              className="bg-white/50 border-gray-300/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Email Address</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
              type="email"
              className="bg-white/50 border-gray-300/50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Phone Number</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="9876543210"
            type="tel"
            className="bg-white/50 border-gray-300/50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Street Address</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="123 Main Street"
            className="bg-white/50 border-gray-300/50"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">City</Label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="Mumbai"
              className="bg-white/50 border-gray-300/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">State</Label>
            <Input
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              placeholder="Maharashtra"
              className="bg-white/50 border-gray-300/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Pincode</Label>
            <Input
              value={formData.pincode}
              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              placeholder="400001"
              className="bg-white/50 border-gray-300/50"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}