import { Button } from "@/components/ui/button";

export function VariantSelector({ variants }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">Select Option</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Button
            key={variant.id}
            variant="outline"
            className="h-auto py-2.5 px-4 rounded-lg border-2 data-[state=active]:border-gray-900 data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all"
          >
            <span className="font-medium text-sm">{variant.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}