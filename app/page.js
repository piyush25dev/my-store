import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Card className="w-[340px] rounded-2xl shadow-lg hover:shadow-xl transition">
        <CardHeader className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">My Store 🛍️</h1>
          <p className="text-sm text-muted-foreground">
            Everything you need, in one place
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="h-40 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white text-lg font-semibold">
            Featured Product
          </div>

          <Button className="w-full rounded-xl text-base">
            Shop Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
