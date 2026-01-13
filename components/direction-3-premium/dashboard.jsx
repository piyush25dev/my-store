import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardPremiumResponsive() {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-background border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold">Creator Studio</h1>
        <Button size="sm">Add</Button>
      </header>

      {/* DESKTOP TOP BAR */}
      <header className="hidden md:block bg-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold tracking-tight">
            Creator Studio
          </h1>

          <nav className="flex gap-6 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Overview</span>
            <span>Products</span>
            <span>Orders</span>
            <span>Settings</span>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 space-y-8">
        {/* PAGE HEADER (DESKTOP ONLY) */}
        <div className="hidden md:flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <Button>Add Product</Button>
        </div>

        {/* KPI CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs text-muted-foreground">Revenue</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl md:text-3xl font-bold">₹3,42,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl md:text-3xl font-bold">612</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs text-muted-foreground">Products</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl md:text-3xl font-bold">14</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs text-muted-foreground">Conversion</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl md:text-3xl font-bold">3.8%</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* SECONDARY SECTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-medium">Recent Orders</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>#1042</span>
                <span className="font-medium">₹2,499</span>
              </div>
              <div className="flex justify-between">
                <span>#1041</span>
                <span className="font-medium">₹799</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>#1040</span>
                <span>₹399</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-medium">Products Snapshot</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Signature Creator System</span>
                <span className="text-muted-foreground">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Notion Planning Kit</span>
                <span className="text-muted-foreground">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Studio Hoodie</span>
                <span className="text-muted-foreground">Sold Out</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden bg-background border-t px-4 py-2 flex justify-around text-xs text-muted-foreground">
        <span className="text-foreground font-medium">Overview</span>
        <span>Products</span>
        <span>Orders</span>
        <span>Settings</span>
      </nav>
    </div>
  );
}
