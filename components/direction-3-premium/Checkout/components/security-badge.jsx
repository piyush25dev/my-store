import { Shield } from "lucide-react";

export function SecurityBadge() {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/30 to-white/30 border border-emerald-200/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Premium Security
          </p>
          <p className="text-xs text-gray-600">
            This transaction is secured and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}