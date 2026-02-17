"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  Eye,
  MessageSquare,
} from "lucide-react";
import MarketplaceLayout from "../../MarketplaceLayout";
import {
  pendingApprovals,
  adminCreators,
  adminAllProducts,
} from "@/app/data/MarketplaceAdmin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function AdminApprovalsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const productApprovals = pendingApprovals.filter((a) => a.type === "Product");
  const creatorApprovals = pendingApprovals.filter((a) => a.type === "Creator");
  const payoutApprovals = pendingApprovals.filter((a) => a.type === "Payout");

  const stats = [
    {
      title: "Total Pending",
      value: pendingApprovals.length,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Product Reviews",
      value: productApprovals.length,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Creator Applications",
      value: creatorApprovals.length,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Payout Requests",
      value: payoutApprovals.length,
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <DollarSign className="h-5 w-5" />,
    },
  ];

  const getIconForType = (type) => {
    switch (type) {
      case "Product":
        return <Package className="h-6 w-6 text-blue-600" />;
      case "Creator":
        return <Users className="h-6 w-6 text-purple-600" />;
      case "Payout":
        return <DollarSign className="h-6 w-6 text-green-600" />;
      default:
        return <Shield className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <MarketplaceLayout userType="admin" showFilters={false}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Pending Approvals</h1>
          </div>
          <p className="text-orange-100">
            Review and approve pending items requiring your attention
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg pt-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium mt-1`}>
                    Needs review
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for Different Approval Types */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-orange-50/30">
          <CardTitle className="text-xl">Review Queue</CardTitle>
          <CardDescription>Approve or reject pending items</CardDescription>
        </CardHeader>
        <CardContent className="!p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b px-6 bg-gray-50/50">
              <TabsList className="flex space-x-2 h-auto gap-2 bg-transparent flex-wrap">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  All ({pendingApprovals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Products ({productApprovals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="creators"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Creators ({creatorApprovals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="payouts"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Payouts ({payoutApprovals.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6">
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <Card
                    key={item.id}
                    className="border-2 border-orange-100 hover:border-orange-200 transition-colors overflow-hidden pt-4"
                  >
                    <CardContent className="p-4 sm:p-6">
                      {/* Mobile-first layout */}
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        {/* Icon - hidden on very small screens? No, keep it but size appropriately */}
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                          {getIconForType(item.type)}
                        </div>

                        {/* Content - takes full width on mobile */}
                        <div className="flex-1 w-full sm:w-auto min-w-0">
                          {/* Header section with title and price */}
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                            <div className="w-full sm:w-auto">
                              {/* Title and badge row */}
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 break-words pr-2">
                                  {item.itemName}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="border-orange-200 text-orange-700 bg-orange-50 text-xs whitespace-nowrap"
                                >
                                  {item.type}
                                </Badge>
                              </div>

                              {/* Creator info */}
                              <p className="text-xs sm:text-sm text-gray-600 break-words">
                                By {item.creator}
                              </p>

                              {/* Description - shown on all screens */}
                              {item.description && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-2 break-words line-clamp-2 sm:line-clamp-none">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Price section - positioned differently on mobile */}
                            {item.price && (
                              <div className="w-full sm:w-auto text-left sm:text-right mt-2 sm:mt-0">
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Metadata row - date and status */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 pt-3 border-t">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">
                                Submitted {item.submittedDate}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-[10px] sm:text-xs whitespace-nowrap"
                            >
                              {item.status}
                            </Badge>
                          </div>

                          {/* Action buttons - responsive grid */}
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-4">
                            {/* Approve button - full width on mobile */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="col-span-2 sm:flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 h-auto"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
                                  <span>Approve</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-[425px] mx-auto p-4 sm:p-6">
                                <DialogHeader>
                                  <DialogTitle className="text-base sm:text-lg">
                                    Approve {item.type}
                                  </DialogTitle>
                                  <DialogDescription className="text-xs sm:text-sm">
                                    Are you sure you want to approve &quot;
                                    {item.itemName}&quot;?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-xs sm:text-sm font-medium text-green-800">
                                      This action will:
                                    </p>
                                    <ul className="text-xs sm:text-sm text-green-700 mt-2 space-y-1 ml-4 list-disc">
                                      {item.type === "Product" && (
                                        <li>
                                          Make the product live on the
                                          marketplace
                                        </li>
                                      )}
                                      {item.type === "Creator" && (
                                        <li>
                                          Grant creator access to the platform
                                        </li>
                                      )}
                                      {item.type === "Payout" && (
                                        <li>
                                          Process the payout to creator&apos;s
                                          account
                                        </li>
                                      )}
                                      <li>
                                        Send confirmation email to{" "}
                                        {item.creator}
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                      variant="outline"
                                      className="flex-1 text-xs sm:text-sm py-2"
                                    >
                                      Cancel
                                    </Button>
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2">
                                      Confirm Approval
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Reject button - full width on mobile */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="col-span-2 sm:flex-1 border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm py-2 h-auto"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
                                  <span>Reject</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-[425px] mx-auto p-4 sm:p-6">
                                <DialogHeader>
                                  <DialogTitle className="text-base sm:text-lg">
                                    Reject {item.type}
                                  </DialogTitle>
                                  <DialogDescription className="text-xs sm:text-sm">
                                    Please provide a reason for rejecting &quot;
                                    {item.itemName}&quot;
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <label className="text-xs sm:text-sm font-medium mb-2 block">
                                      Rejection Reason
                                    </label>
                                    <Textarea
                                      placeholder="Explain why this item is being rejected..."
                                      rows={3}
                                      className="text-sm"
                                      value={rejectReason}
                                      onChange={(e) =>
                                        setRejectReason(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                      variant="outline"
                                      className="flex-1 text-xs sm:text-sm py-2"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="flex-1 bg-red-600 hover:bg-red-700 text-xs sm:text-sm py-2"
                                      disabled={!rejectReason.trim()}
                                    >
                                      Confirm Rejection
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Icon buttons - now in their own row on mobile */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 sm:h-10 sm:w-10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 sm:h-10 sm:w-10"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pendingApprovals.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All Caught Up!
                    </h3>
                    <p className="text-gray-500">
                      There are no pending approvals at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="products" className="p-6">
              <div className="space-y-4">
                {productApprovals.length > 0 ? (
                  productApprovals.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <p className="font-semibold">{item.itemName}</p>
                      <p className="text-sm text-gray-500">By {item.creator}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No product approvals pending
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="creators" className="p-6">
              <div className="space-y-4">
                {creatorApprovals.length > 0 ? (
                  creatorApprovals.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <p className="font-semibold">{item.itemName}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No creator applications pending
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="payouts" className="p-6">
              <div className="space-y-4">
                {payoutApprovals.length > 0 ? (
                  payoutApprovals.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.creator}</p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No payout requests pending
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MarketplaceLayout>
  );
}
