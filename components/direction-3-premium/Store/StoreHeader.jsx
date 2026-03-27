import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function StoreHeader() {
  return (
    <div className="mb-20 text-center">
      <div className="relative mx-auto mb-8 inline-flex">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-100 to-amber-100 blur"></div>
        <Avatar className="relative h-32 w-32 border-4 border-white shadow-lg">
          <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-rose-100 to-amber-100 text-rose-900">
            CS
          </AvatarFallback>
        </Avatar>
      </div>

      <h1 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
        Creator Studio
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-gray-600">
        A premium collection of thoughtfully crafted tools
        and products for modern creators.
      </p>
    </div>
  );
}