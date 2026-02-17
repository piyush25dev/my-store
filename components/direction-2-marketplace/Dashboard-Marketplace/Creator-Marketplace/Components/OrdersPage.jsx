"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, Package, Truck, CheckCircle, XCircle, 
  Search, Filter, Eye, Download, ArrowUpDown, Calendar 
} from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { creatorOrders } from '@/app/data/Marketplacedata';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredOrders = creatorOrders.filter(order => {
    return selectedStatus === 'all' || order.status === selectedStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Processing':
        return <Package className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const totalRevenue = creatorOrders.reduce((sum, order) => sum + order.amount, 0);
  const deliveredCount = creatorOrders.filter(o => o.status === 'Delivered').length;
  const processingCount = creatorOrders.filter(o => o.status === 'Processing').length;
  const shippedCount = creatorOrders.filter(o => o.status === 'Shipped').length;

  return (
    <MarketplaceLayout pageTitle="Orders" showFilters={false} userType="creator">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by order ID, customer, or product..." 
              className="pl-9"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{creatorOrders.length}</p>
                <p className="text-sm text-green-600 font-medium mt-1">+12% this month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Processing</p>
                <p className="text-2xl font-bold mt-1">{processingCount}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">Needs attention</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Shipped</p>
                <p className="text-2xl font-bold mt-1">{shippedCount}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">In transit</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Delivered</p>
                <p className="text-2xl font-bold mt-1">{deliveredCount}</p>
                <p className="text-sm text-green-600 font-medium mt-1">Completed</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table - Desktop */}
      <Card className="border-0 shadow-lg hidden md:block">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
          <CardTitle className="text-xl">All Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    Order ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-purple-50/30">
                  <TableCell className="font-semibold text-purple-600">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{order.product}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {order.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        order.status === 'Delivered' 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : order.status === 'Processing' 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-purple-100"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                          <DialogDescription>Complete order information and tracking</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-3">Customer Information</h3>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{selectedOrder.customer}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Shipping Address</p>
                                    <p className="font-medium">{selectedOrder.shippingAddress}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-3">Order Information</h3>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm text-gray-500">Product</p>
                                    <p className="font-medium">{selectedOrder.product}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium">{selectedOrder.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                                  </div>
                                  {selectedOrder.trackingNumber && (
                                    <div>
                                      <p className="text-sm text-gray-500">Tracking Number</p>
                                      <p className="font-medium text-purple-600">{selectedOrder.trackingNumber}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Amount</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {formatCurrency(selectedOrder.amount)}
                                </span>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h3 className="font-semibold mb-3">Order Status</h3>
                              <Badge 
                                className={`text-base px-4 py-2 ${
                                  selectedOrder.status === 'Delivered' 
                                    ? 'bg-green-500' 
                                    : selectedOrder.status === 'Processing' 
                                    ? 'bg-orange-500' 
                                    : 'bg-blue-500'
                                }`}
                              >
                                {selectedOrder.status}
                              </Badge>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button className="flex-1" variant="outline">
                                Print Invoice
                              </Button>
                              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
                                Update Status
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Orders List - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-0 shadow-lg pt-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-purple-600">{order.id}</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.product}</p>
                </div>
                <Badge 
                  className={
                    order.status === 'Delivered' 
                      ? 'bg-green-500' 
                      : order.status === 'Processing' 
                      ? 'bg-orange-500' 
                      : 'bg-blue-500'
                  }
                >
                  {order.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">{order.date}</span>
                <span className="font-bold text-green-600">{formatCurrency(order.amount)}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => setSelectedOrder(order)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </MarketplaceLayout>
  );
}