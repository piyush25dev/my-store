"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Ban, CheckCircle, Package, Search, Filter, Download } from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { adminAllProducts } from '@/app/data/MarketplaceAdmin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminProductsPage() {
  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const stats = [
    { title: "Total Products", value: adminAllProducts.length, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Active Products", value: adminAllProducts.filter(p => p.status === 'Active').length, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Under Review", value: adminAllProducts.filter(p => p.status === 'Review').length, color: "text-orange-600", bgColor: "bg-orange-100" },
    { title: "Flagged Items", value: adminAllProducts.filter(p => p.flagged).length, color: "text-red-600", bgColor: "bg-red-100" }
  ];

  return (
    <MarketplaceLayout userType="admin" showFilters={false}>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">Review and moderate all platform products</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search products by name, creator, or category..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Package className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
          <CardTitle className="text-xl">All Platform Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Creator</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Sales</TableHead>
                <TableHead className="font-semibold">Revenue</TableHead>
                <TableHead className="font-semibold">Rating</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminAllProducts.map((product) => (
                <TableRow key={product.id} className={`hover:bg-purple-50/30 ${product.flagged ? 'bg-red-50' : ''}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.creator}</p>
                      <p className="text-sm text-gray-500">{product.storeName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="font-semibold">{product.sales}</TableCell>
                  <TableCell className="font-bold text-green-600">{formatCurrency(product.revenue)}</TableCell>
                  <TableCell>
                    <span className="font-semibold">⭐ {product.rating || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      product.status === 'Active' ? 'bg-green-500' :
                      product.status === 'Review' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }>
                      {product.status}
                    </Badge>
                    {product.flagged && (
                      <Badge className="bg-red-500 ml-1">Flagged</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="hover:bg-purple-100">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {product.status === 'Review' && (
                        <Button size="icon" variant="ghost" className="hover:bg-green-100">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="hover:bg-red-100">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MarketplaceLayout>
  );
}