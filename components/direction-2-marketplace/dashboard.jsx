import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
const products = [
  {
    id: 1,
    name: "Instagram Hooks Pack",
    type: "Digital",
    price: "₹399",
    inventory: "Unlimited",
    status: "Active",
  },
  {
    id: 2,
    name: "Creator Hoodie",
    type: "Physical",
    price: "₹1,499",
    inventory: "0",
    status: "Out",
  },
];

export default function DashboardMarketplaceMobileFirst() {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-background border-b p-4 flex justify-between items-center">
        <h1 className="font-bold">Dashboard</h1>
        <Button size="sm">Add</Button>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-background border-r p-4 space-y-4">
          <h2 className="text-lg font-bold">Seller Dashboard</h2>

          <nav className="space-y-2 text-sm">
            <p className="font-medium">Products</p>
            <p className="text-muted-foreground">Orders</p>
            <p className="text-muted-foreground">Customers</p>
            <p className="text-muted-foreground">Payouts</p>
            <p className="text-muted-foreground">Settings</p>
          </nav>

          <Separator />

          <Button size="sm" variant="outline">
            View Store
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-6">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center">
            <h1 className="text-xl font-bold">Products</h1>
            <Button>Add Product</Button>
          </div>

          {/* Filters (Mobile First) */}
          <div className="space-y-3">
            <Input placeholder="Search products…" />

            <Tabs defaultValue="all">
              <TabsList className="overflow-x-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="out">Out of Stock</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* MOBILE PRODUCT LIST */}
<div className="space-y-4 md:hidden">
  {products.map((product) => (
    <Card
      key={product.id}
      className={product.status === "Out" ? "opacity-60" : ""}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-xs text-muted-foreground">
              {product.type} · {product.inventory}
            </p>
          </div>
          <Badge variant={product.status === "Out" ? "outline" : "default"}>
            {product.status === "Out" ? "Out of Stock" : "Active"}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold">{product.price}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={product.status === "Out"}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>


          {/* DESKTOP TABLE (CONTENT-HEAVY) */}
         {/* DESKTOP TABLE */}
<div className="hidden md:block">
  <Card>
    <CardHeader>
      <h2 className="font-semibold">Product List</h2>
    </CardHeader>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>
                <Badge
                  variant={product.status === "Out" ? "outline" : "default"}
                >
                  {product.status === "Out" ? "Out of Stock" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={product.status === "Out"}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>

        </main>
      </div>
    </div>
  );
}
