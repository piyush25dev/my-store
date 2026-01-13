import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardMinimal() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-60 flex-col border-r p-4 space-y-6">
        <h2 className="font-bold text-lg">Creator Panel</h2>

        <nav className="space-y-3 text-sm">
          <p className="font-medium">Dashboard</p>
          <p className="text-muted-foreground">Products</p>
          <p className="text-muted-foreground">Orders</p>
          <p className="text-muted-foreground">Settings</p>
        </nav>

        <Separator />

        <Button variant="outline">View Store</Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Button>Add Product</Button>
        </div>

        {/* Dashboard Home (Summary Cards) */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">₹42,300</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Orders</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">128</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Products</p>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">6 Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Section Previews */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Products Section Preview */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold">Products</h2>
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Notion Creator Kit</p>
              <p>Instagram Hooks Pack</p>
              <p className="text-muted-foreground">+ 4 more</p>
            </CardContent>
          </Card>

          {/* Orders Section Preview */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold">Recent Orders</h2>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>#1023 — ₹799</p>
              <p>#1022 — ₹399</p>
              <p className="text-muted-foreground">+ 12 more</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
