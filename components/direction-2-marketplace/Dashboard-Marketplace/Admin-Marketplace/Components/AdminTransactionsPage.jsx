"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Eye, Calendar
} from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { adminTransactions, platformAnalytics } from '@/app/data/MarketplaceAdmin';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminTransactionsPage() {
  const [selectedType, setSelectedType] = useState('all');

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredTransactions = adminTransactions.filter(txn => {
    return selectedType === 'all' || txn.type === selectedType;
  });

  const stats = [
    {
      title: "Total Transaction Volume",
      value: formatCurrency(platformAnalytics.overview.totalRevenue),
      change: "+18.3%",
      trending: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Platform Fees Collected",
      value: formatCurrency(platformAnalytics.overview.platformFees),
      change: "+15.2%",
      trending: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "Creator Earnings",
      value: formatCurrency(platformAnalytics.overview.creatorEarnings),
      change: "+19.1%",
      trending: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <ArrowUpRight className="h-5 w-5" />
    },
    {
      title: "Total Transactions",
      value: platformAnalytics.overview.totalTransactions.toLocaleString(),
      change: "+14.7%",
      trending: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      icon: <RefreshCw className="h-5 w-5" />
    }
  ];

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'Sale':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'Payout':
        return <ArrowDownRight className="h-4 w-4 text-purple-600" />;
      case 'Refund':
        return <RefreshCw className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'Sale':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Payout':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'Refund':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <MarketplaceLayout userType="admin" showFilters={false}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="text-gray-500 mt-1">Monitor all platform financial transactions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by transaction ID, buyer, seller, or product..." 
              className="pl-9"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sale">Sales</SelectItem>
              <SelectItem value="Payout">Payouts</SelectItem>
              <SelectItem value="Refund">Refunds</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
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
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg pt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trending === 'up' ? (
                      <TrendingUp className={`h-4 w-4 ${stat.color}`} />
                    ) : (
                      <ArrowDownRight className={`h-4 w-4 ${stat.color}`} />
                    )}
                    <span className={`text-sm font-semibold ${stat.color}`}>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table - Desktop */}
      <Card className="border-0 shadow-lg hidden md:block">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
          <CardTitle className="text-xl">All Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Transaction ID</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Buyer/Recipient</TableHead>
                <TableHead className="font-semibold">Seller/Sender</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Platform Fee</TableHead>
                <TableHead className="font-semibold">Date & Time</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id} className="hover:bg-green-50/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(txn.type)}
                      <span className="font-semibold text-purple-600">{txn.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTransactionColor(txn.type)}>
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{txn.buyer || 'N/A'}</p>
                      {txn.buyer && <p className="text-xs text-gray-500">ID: {txn.buyerId}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{txn.seller}</p>
                      <p className="text-xs text-gray-500">ID: {txn.sellerId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{txn.product || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <p className={`font-bold ${
                      txn.type === 'Sale' ? 'text-green-600' : 
                      txn.type === 'Refund' ? 'text-red-600' : 
                      'text-purple-600'
                    }`}>
                      {formatCurrency(txn.amount)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-700">{formatCurrency(Math.abs(txn.platformFee))}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(txn.date).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.date).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        txn.status === 'Completed' ? 'bg-green-500' :
                        txn.status === 'Processing' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="hover:bg-purple-100">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transactions List - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((txn) => (
          <Card key={txn.id} className="border-0 shadow-lg pt-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTransactionIcon(txn.type)}
                  <div>
                    <p className="font-semibold text-purple-600 text-sm">{txn.id}</p>
                    <Badge variant="outline" className={`${getTransactionColor(txn.type)} mt-1 text-xs`}>
                      {txn.type}
                    </Badge>
                  </div>
                </div>
                <Badge className={
                  txn.status === 'Completed' ? 'bg-green-500' :
                  txn.status === 'Processing' ? 'bg-orange-500' :
                  'bg-blue-500'
                }>
                  {txn.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className={`font-bold ${
                    txn.type === 'Sale' ? 'text-green-600' : 
                    txn.type === 'Refund' ? 'text-red-600' : 
                    'text-purple-600'
                  }`}>
                    {formatCurrency(txn.amount)}
                  </span>
                </div>
                {txn.buyer && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buyer:</span>
                    <span className="font-medium">{txn.buyer}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Seller:</span>
                  <span className="font-medium">{txn.seller}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Fee:</span>
                  <span className="font-semibold">{formatCurrency(Math.abs(txn.platformFee))}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
                <span>{new Date(txn.date).toLocaleDateString('en-IN')}</span>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MarketplaceLayout>
  );
}