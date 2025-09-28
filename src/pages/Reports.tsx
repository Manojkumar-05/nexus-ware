import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useOrg } from '@/contexts/OrgContext';
import ChangeOrgDialog from '@/components/ChangeOrgDialog';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  IndianRupee as DollarSign,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Target,
  PieChart,
  LineChart,
  Activity,
  FileText,
  Eye,
  Printer
} from 'lucide-react';
import { formatINR, usdToInr } from '@/utils/currency';

const Reports = () => {
  const { user, signOut } = useAuth();
  const { organizationName } = useOrg();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Mock data for reports
  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 45, customers: 38 },
    { month: 'Feb', revenue: 52000, orders: 52, customers: 44 },
    { month: 'Mar', revenue: 48000, orders: 48, customers: 41 },
    { month: 'Apr', revenue: 61000, orders: 61, customers: 52 },
    { month: 'May', revenue: 55000, orders: 55, customers: 47 },
    { month: 'Jun', revenue: 67000, orders: 67, customers: 58 }
  ];

  const topProducts = [
    { name: "Laptop Dell XPS 13", sales: 23, revenue: 29899.77, growth: "+15%" },
    { name: "Wireless Mouse Logitech MX Master", sales: 45, revenue: 3599.55, growth: "+8%" },
    { name: "LED Desk Lamp", sales: 67, revenue: 3349.33, growth: "+22%" },
    { name: "Steel Office Chair", sales: 12, revenue: 3599.88, growth: "+5%" }
  ];

  const topCustomers = [
    { name: "John Smith", orders: 8, totalSpent: 5439.92, lastOrder: "2024-01-15" },
    { name: "Emily Davis", orders: 6, totalSpent: 2899.82, lastOrder: "2024-01-14" },
    { name: "Robert Chen", orders: 5, totalSpent: 2399.85, lastOrder: "2024-01-13" },
    { name: "Lisa Brown", orders: 4, totalSpent: 1649.97, lastOrder: "2024-01-12" }
  ];

  const inventoryMetrics = [
    { category: "Electronics", items: 45, value: 58499.55, lowStock: 2 },
    { category: "Furniture", items: 23, value: 6899.77, lowStock: 1 },
    { category: "Lighting", items: 67, value: 3349.33, lowStock: 0 },
    { category: "Office Supplies", items: 34, value: 1249.66, lowStock: 3 }
  ];

  const supplierPerformance = [
    { name: "TechCorp Industries", rating: 4.8, orders: 156, reliability: "Excellent" },
    { name: "Global Materials Ltd", rating: 4.5, orders: 89, reliability: "Good" },
    { name: "Quality Parts Co", rating: 3.9, orders: 67, reliability: "Fair" },
    { name: "Eco Supplies Inc", rating: 4.9, orders: 234, reliability: "Excellent" }
  ];

  const getGrowthColor = (growth: string) => {
    return growth.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const getReliabilityBadge = (reliability: string) => {
    const reliabilityConfig = {
      'Excellent': "bg-green-100 text-green-800",
      'Good': "bg-blue-100 text-blue-800",
      'Fair': "bg-yellow-100 text-yellow-800",
      'Poor': "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={reliabilityConfig[reliability as keyof typeof reliabilityConfig]}>
        {reliability}
      </Badge>
    );
  };

  const generateReport = () => {
    // Mock report generation
    console.log(`Generating ${reportType} report for ${dateRange} in ${exportFormat} format`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{organizationName} • Reports</h1>
              <ChangeOrgDialog />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
              <p className="text-muted-foreground">
                Generate comprehensive reports and view detailed analytics
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate Custom Report</DialogTitle>
                <DialogDescription>
                  Configure and generate a custom report based on your requirements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reportType" className="text-right">
                    Report Type
                  </Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="customers">Customer Report</SelectItem>
                      <SelectItem value="suppliers">Supplier Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateRange" className="text-right">
                    Date Range
                  </Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="exportFormat" className="text-right">
                    Export Format
                  </Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes for the report"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={generateReport}>Generate Report</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(salesData.reduce((sum, month) => sum + month.revenue, 0)))}</div>
              <p className="text-xs text-muted-foreground">
                Last 6 months
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesData.reduce((sum, month) => sum + month.orders, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 6 months
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...salesData.map(month => month.customers))}
              </div>
              <p className="text-xs text-muted-foreground">
                Peak month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+18.2%</div>
              <p className="text-xs text-muted-foreground">
                vs previous period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revenue Trend Analysis</CardTitle>
            <CardDescription>
              Monthly revenue performance over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {salesData.map((data, index) => {
                const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                const percentage = (data.revenue / maxRevenue) * 100;
                const isGrowing = index > 0 && data.revenue > salesData[index - 1].revenue;
                
                return (
                  <div key={data.month} className="text-center">
                    <div className="text-sm font-medium mb-2">{data.month}</div>
                    <div className="text-2xl font-bold text-primary mb-1">{formatINR(usdToInr(data.revenue))}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {data.orders} orders
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      {isGrowing ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="mt-2">
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Products Performance</CardTitle>
            <CardDescription>
              Best-selling products with revenue and growth metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Growth</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product, index) => {
                  const maxSales = Math.max(...topProducts.map(p => p.sales));
                  const performancePercentage = (product.sales / maxSales) * 100;
                  
                  return (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>{formatINR(usdToInr(product.revenue))}</TableCell>
                      <TableCell className={getGrowthColor(product.growth)}>
                        {product.growth}
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center space-x-2">
                          <Progress value={performancePercentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12">
                            {performancePercentage.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer and Inventory Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>
                Most valuable customers by order volume and spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Last order: {customer.lastOrder}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{customer.orders} orders</div>
                      <div className="text-sm text-muted-foreground">{formatINR(usdToInr(customer.totalSpent))}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>
                Category-wise inventory status and value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryMetrics.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.items} items
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Value: {formatINR(usdToInr(category.value))}</span>
                      <span className={category.lowStock > 0 ? 'text-red-600' : 'text-green-600'}>
                        {category.lowStock > 0 ? `${category.lowStock} low stock` : 'Well stocked'}
                      </span>
                    </div>
                    <Progress 
                      value={((category.items - category.lowStock) / category.items) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Supplier Performance Analysis</CardTitle>
            <CardDescription>
              Supplier ratings, order volume, and reliability metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Reliability</TableHead>
                  <TableHead>Performance Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierPerformance.map((supplier) => {
                  const performanceScore = (supplier.rating / 5) * 100;
                  
                  return (
                    <TableRow key={supplier.name}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{supplier.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.orders}</TableCell>
                      <TableCell>{getReliabilityBadge(supplier.reliability)}</TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center space-x-2">
                          <Progress value={performanceScore} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12">
                            {performanceScore.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Report Templates</CardTitle>
            <CardDescription>
              Pre-configured report templates for common business needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Daily Sales Summary</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Daily overview of sales performance, top products, and customer activity
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <Package className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">Inventory Status</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete inventory overview with stock levels, low stock alerts, and value
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium">Customer Insights</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Customer behavior analysis, top customers, and retention metrics
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
