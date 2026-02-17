"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  Eye, Edit, Ban, CheckCircle, XCircle, Search, Filter, 
  Download, Mail, Shield, TrendingUp, Package, DollarSign, Star
} from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { adminCreators } from '@/app/data/MarketplaceAdmin';
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

export default function AdminCreatorsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCreator, setSelectedCreator] = useState(null);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredCreators = adminCreators.filter(creator => {
    return selectedStatus === 'all' || creator.status === selectedStatus;
  });

  const stats = [
    {
      title: "Total Creators",
      value: adminCreators.length,
      change: "+12 this month",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Active Creators",
      value: adminCreators.filter(c => c.status === 'Active').length,
      change: "215 stores",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: "Pending Review",
      value: adminCreators.filter(c => c.status === 'Pending').length,
      change: "Needs approval",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "Total Revenue",
      value: formatCurrency(adminCreators.reduce((sum, c) => sum + c.totalSales, 0)),
      change: "+18.3% growth",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <DollarSign className="h-5 w-5" />
    }
  ];

  return (
    <MarketplaceLayout userType="admin" showFilters={false}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Management</h1>
            <p className="text-gray-500 mt-1">Manage all creators and their stores on the platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Shield className="h-4 w-4 mr-2" />
              Add Creator
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by name, email, store, or category..." 
              className="pl-9"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="revenue">Highest Revenue</SelectItem>
              <SelectItem value="sales">Most Sales</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg pt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium mt-1`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Creators Table - Desktop */}
      <Card className="border-0 shadow-lg hidden md:block">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
          <CardTitle className="text-xl">All Creators ({filteredCreators.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Creator</TableHead>
                <TableHead className="font-semibold">Store Details</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Orders</TableHead>
                <TableHead className="font-semibold">Revenue</TableHead>
                <TableHead className="font-semibold">Commission</TableHead>
                <TableHead className="font-semibold">Rating</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreators.map((creator) => (
                <TableRow key={creator.id} className="hover:bg-purple-50/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-purple-100">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{creator.name}</p>
                          {creator.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{creator.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{creator.storeName}</p>
                      <p className="text-sm text-gray-500">{creator.category}</p>
                      <p className="text-xs text-gray-400 mt-1">Joined {creator.joinDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{creator.totalProducts}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{creator.totalOrders}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-green-600">{formatCurrency(creator.totalSales)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                      {creator.commission}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{creator.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          creator.status === 'Active' ? 'bg-green-500' :
                          creator.status === 'Pending' ? 'bg-orange-500' :
                          'bg-red-500'
                        }
                      >
                        {creator.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="hover:bg-purple-100"
                            onClick={() => setSelectedCreator(creator)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Creator Details - {creator.name}</DialogTitle>
                            <DialogDescription>Complete profile and performance metrics</DialogDescription>
                          </DialogHeader>
                          {selectedCreator && (
                            <div className="space-y-6 mt-4">
                              <div className="flex items-start gap-6">
                                <Avatar className="h-24 w-24 border-4 border-purple-100">
                                  <AvatarImage src={selectedCreator.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl">
                                    {selectedCreator.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-2xl font-bold">{selectedCreator.name}</h3>
                                    {selectedCreator.verified && (
                                      <CheckCircle className="h-6 w-6 text-blue-500" />
                                    )}
                                  </div>
                                  <p className="text-gray-600">{selectedCreator.email}</p>
                                  <div className="flex gap-3 mt-3">
                                    <Badge className={
                                      selectedCreator.status === 'Active' ? 'bg-green-500' :
                                      selectedCreator.status === 'Pending' ? 'bg-orange-500' :
                                      'bg-red-500'
                                    }>
                                      {selectedCreator.status}
                                    </Badge>
                                    <Badge variant="outline">{selectedCreator.category}</Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                                  <p className="text-2xl font-bold text-blue-600">{selectedCreator.totalProducts}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCreator.totalSales)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                  <p className="text-2xl font-bold text-purple-600">{selectedCreator.totalOrders}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6 border-t pt-4">
                                <div>
                                  <h4 className="font-semibold mb-3">Store Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Store Name:</span>
                                      <span className="font-medium ml-2">{selectedCreator.storeName}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Store URL:</span>
                                      <span className="font-medium ml-2">/{selectedCreator.storeUrl}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Commission Rate:</span>
                                      <span className="font-medium ml-2">{selectedCreator.commission}%</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Rating:</span>
                                      <span className="font-medium ml-2">⭐ {selectedCreator.rating}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Financial</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Payout Pending:</span>
                                      <span className="font-bold text-orange-600 ml-2">{formatCurrency(selectedCreator.payoutPending)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Last Active:</span>
                                      <span className="font-medium ml-2">{selectedCreator.lastActive}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Join Date:</span>
                                      <span className="font-medium ml-2">{selectedCreator.joinDate}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-3 pt-4 border-t">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Creator
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" className="hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="hover:bg-green-100">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Creators List - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredCreators.map((creator) => (
          <Card key={creator.id} className="border-0 shadow-lg pt-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-purple-100">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    {creator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                      {creator.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    </div>
                    <Badge className={
                      creator.status === 'Active' ? 'bg-green-500' :
                      creator.status === 'Pending' ? 'bg-orange-500' :
                      'bg-red-500'
                    }>
                      {creator.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{creator.storeName}</p>
                  <p className="text-xs text-gray-400 mt-1">{creator.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b">
                <div>
                  <p className="text-xs text-gray-500">Products</p>
                  <p className="font-semibold">{creator.totalProducts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="font-semibold">{creator.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="font-semibold text-green-600 text-sm">{formatCurrency(creator.totalSales)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MarketplaceLayout>
  );
}