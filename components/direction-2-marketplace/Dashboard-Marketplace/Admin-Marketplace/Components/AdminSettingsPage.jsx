"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, DollarSign, Shield, Bell, Database, Mail, Code, Save } from 'lucide-react';
import MarketplaceLayout from '../../MarketplaceLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  return (
    <MarketplaceLayout userType="admin" showSearch={false} showFilters={false}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 mt-1">Configure platform-wide settings and policies</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto bg-white p-2 border shadow-sm rounded-xl">
          <TabsTrigger value="general" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="commission" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <DollarSign className="h-4 w-4 mr-2" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <Code className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 pt-4">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input defaultValue="CreatorMarket Platform" />
              </div>
              <div className="space-y-2">
                <Label>Platform Description</Label>
                <Textarea rows={3} defaultValue="A marketplace for creators to sell digital and physical products" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@creatormarket.com" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input defaultValue="+91 98765 43210" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Temporarily disable the platform</p>
                </div>
                <Switch />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
              <CardTitle>Commission Settings</CardTitle>
              <CardDescription>Configure platform commission rates</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Default Rate (%)</Label>
                  <Input type="number" defaultValue="15" />
                  <p className="text-xs text-gray-500">For standard creators</p>
                </div>
                <div className="space-y-2">
                  <Label>Premium Rate (%)</Label>
                  <Input type="number" defaultValue="10" />
                  <p className="text-xs text-gray-500">For premium creators</p>
                </div>
                <div className="space-y-2">
                  <Label>Enterprise Rate (%)</Label>
                  <Input type="number" defaultValue="5" />
                  <p className="text-xs text-gray-500">For enterprise accounts</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Payout Amount (₹)</Label>
                <Input type="number" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <Label>Payout Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                <Save className="h-4 w-4 mr-2" />
                Save Commission Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-red-50/30">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage platform security and access control</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Email Verification</p>
                  <p className="text-sm text-gray-500">Users must verify email before accessing platform</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Approve Creators</p>
                  <p className="text-sm text-gray-500">Automatically approve verified creators</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <Button className="bg-gradient-to-r from-red-600 to-pink-600">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure platform notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Creator Notifications</p>
                  <p className="text-sm text-gray-500">Alert when new creators join</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High-Value Transaction Alerts</p>
                  <p className="text-sm text-gray-500">Notify for transactions over ₹10,000</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Flagged Content Alerts</p>
                  <p className="text-sm text-gray-500">Immediate notification for flagged items</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-slate-50">
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Database maintenance and backups</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-slate-50 border">
                <p className="font-medium mb-2">Database Status</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold">12.3 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Backup:</span>
                    <span className="font-semibold">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-semibold">2.4M</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Backup Database Now</Button>
              <Button variant="outline" className="w-full">Optimize Database</Button>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                Clear Cache
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-indigo-50/30">
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email service settings</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 pt-4">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input defaultValue="smtp.example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input defaultValue="noreply@creatormarket.com" />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <Save className="h-4 w-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-cyan-50/30">
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API access and rate limits</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Public API</p>
                  <p className="text-sm text-gray-500">Allow third-party integrations</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Rate Limit (requests/hour)</Label>
                <Input type="number" defaultValue="1000" />
              </div>
              <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                <p className="font-medium text-cyan-900 mb-2">API Key</p>
                <code className="text-sm text-cyan-700 break-all">sk_live_123456789abcdefghijklmnop</code>
              </div>
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
                <Save className="h-4 w-4 mr-2" />
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MarketplaceLayout>
  );
}