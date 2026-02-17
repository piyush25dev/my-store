"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, UserPlus, Mail, Phone, MapPin, ShoppingBag, 
  DollarSign, Search, Filter, Download, Star, TrendingUp 
} from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { customerData } from '@/app/data/Marketplacedata';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomersPage() {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalCustomers = customerData.length;
  const vipCustomers = customerData.filter(c => c.status === 'VIP').length;
  const totalSpent = customerData.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalSpent / customerData.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <MarketplaceLayout pageTitle="Customers" showFilters={false} userType="creator">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">Manage your customer relationships</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-200">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search customers by name, email, or location..." 
              className="pl-9"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="spending">Highest Spending</SelectItem>
              <SelectItem value="orders">Most Orders</SelectItem>
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
                <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
                <p className="text-sm text-green-600 font-medium mt-1">+15 this month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">VIP Customers</p>
                <p className="text-2xl font-bold mt-1">{vipCustomers}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">Top tier</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600 fill-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
                <p className="text-sm text-green-600 font-medium mt-1">From customers</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg Order Value</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(avgOrderValue)}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">Per customer</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table - Desktop */}
      <Card className="border-0 shadow-lg hidden md:block">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
          <CardTitle className="text-xl">All Customers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Total Orders</TableHead>
                <TableHead className="font-semibold">Total Spent</TableHead>
                <TableHead className="font-semibold">Join Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-purple-50/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-purple-100">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: #{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {customer.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{customer.totalOrders}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-gray-600">{customer.joinDate}</TableCell>
                  <TableCell>
                    <Badge 
                      className={customer.status === 'VIP' ? 'bg-purple-500' : 'bg-blue-500'}
                    >
                      {customer.status === 'VIP' && <Star className="h-3 w-3 mr-1" />}
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-purple-100">
                        View Profile
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-blue-100">
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

      {/* Customers List - Mobile */}
      <div className="md:hidden space-y-4">
        {customerData.map((customer) => (
          <Card key={customer.id} className="border-0 shadow-lg pt-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-purple-100">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <Badge className={customer.status === 'VIP' ? 'bg-purple-500' : 'bg-blue-500'}>
                      {customer.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {customer.location}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b">
                <div>
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="font-semibold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="font-semibold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-semibold text-sm">{customer.joinDate.split('-')[0]}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Customers Section */}
      <Card className="border-0 shadow-lg mt-6">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-yellow-50/30">
          <CardTitle className="text-xl flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
            Top Customers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerData
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 3)
              .map((customer, index) => (
                <div 
                  key={customer.id} 
                  className={`p-6 rounded-xl border-2 ${
                    index === 0 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' :
                    index === 1 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50' :
                    'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-400 text-white' : 
                        'bg-orange-500 text-white'}
                    `}>
                      {index + 1}
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{customer.email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-bold text-green-600">{formatCurrency(customer.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Orders</span>
                      <span className="font-semibold">{customer.totalOrders}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </MarketplaceLayout>
  );
}