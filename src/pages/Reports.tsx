import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useOrg } from '@/contexts/OrgContext';
import ChangeOrgDialog from '@/components/ChangeOrgDialog';
import { useNavigate } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { exportToCsv } from '@/utils/csv';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Download,
  IndianRupee as DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { formatINR, usdToInr } from '@/utils/currency';

const Reports = () => {
  const { user, signOut } = useAuth();
  const { organizationName } = useOrg();
  const navigate = useNavigate();
  const { 
    loading,
    generateDailySalesSummary,
    generateInventoryStatus,
    generateCustomerInsights
  } = useReports();

  const handleGenerateDailySales = () => {
    const report = generateDailySalesSummary();
    const csvData = report.sales.map(sale => ({
      Date: sale.date,
      Customer: sale.customer,
      Total: formatINR(usdToInr(Number(sale.total))),
      Payment: sale.payment_method,
      Salesperson: sale.salesperson
    }));
    
    exportToCsv(`daily-sales-${report.date}.csv`, csvData);
    toast({
      title: "Report Generated",
      description: `Daily Sales Summary for ${report.date} exported successfully`
    });
  };

  const handleGenerateInventoryStatus = () => {
    const report = generateInventoryStatus();
    const csvData = report.inventory.map(item => ({
      SKU: item.sku,
      Name: item.name,
      Category: item.category,
      Quantity: item.quantity,
      'Unit Price': formatINR(usdToInr(Number(item.unit_price))),
      'Total Value': formatINR(usdToInr(Number(item.unit_price) * item.quantity)),
      Status: item.quantity <= item.reorder_point ? 'LOW STOCK' : item.quantity === 0 ? 'OUT OF STOCK' : 'IN STOCK',
      Location: item.location
    }));
    
    exportToCsv('inventory-status.csv', csvData);
    toast({
      title: "Report Generated",
      description: "Inventory Status Report exported successfully"
    });
  };

  const handleGenerateCustomerInsights = () => {
    const report = generateCustomerInsights();
    const csvData = report.customers.map(customer => ({
      Name: customer.name,
      Email: customer.email,
      Company: customer.company,
      Tier: customer.tier,
      'Total Orders': customer.total_orders,
      'Total Spent': formatINR(usdToInr(Number(customer.total_spent))),
      'Avg Order Value': formatINR(usdToInr(Number(customer.avg_order_value))),
      Status: customer.status,
      'Customer Since': customer.customer_since
    }));
    
    exportToCsv('customer-insights.csv', csvData);
    toast({
      title: "Report Generated",
      description: "Customer Insights Report exported successfully"
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading reports...</div>;
  }

  const dailySales = generateDailySalesSummary();
  const inventoryStatus = generateInventoryStatus();
  const customerInsights = generateCustomerInsights();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {organizationName} • Reports
              </h1>
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
                Generate comprehensive reports from your live data
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Daily Sales Summary
              </CardTitle>
              <CardDescription>Today's sales performance and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-semibold">{formatINR(usdToInr(dailySales.totalRevenue))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="font-semibold">{dailySales.totalTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Transaction</span>
                  <span className="font-semibold">{formatINR(usdToInr(dailySales.avgTransaction))}</span>
                </div>
              </div>
              <Button onClick={handleGenerateDailySales} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Status
              </CardTitle>
              <CardDescription>Current inventory levels and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Items</span>
                  <span className="font-semibold">{inventoryStatus.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-semibold">{formatINR(usdToInr(inventoryStatus.totalValue))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Low Stock</span>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {inventoryStatus.lowStockCount}
                  </Badge>
                </div>
              </div>
              <Button onClick={handleGenerateInventoryStatus} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Insights
              </CardTitle>
              <CardDescription>Customer analytics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Customers</span>
                  <span className="font-semibold">{customerInsights.totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-semibold">{customerInsights.activeCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Spending</span>
                  <span className="font-semibold">{formatINR(usdToInr(customerInsights.avgSpending))}</span>
                </div>
              </div>
              <Button onClick={handleGenerateCustomerInsights} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest spending customers</CardDescription>
            </CardHeader>
            <CardContent>
              {customerInsights.topCustomers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No customer data available
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInsights.topCustomers.slice(0, 5).map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.total_orders}</TableCell>
                        <TableCell>{formatINR(usdToInr(Number(customer.total_spent)))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Items requiring reorder</CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryStatus.lowStockItems.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  All items are well stocked
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reorder Point</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryStatus.lowStockItems.slice(0, 5).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{item.quantity}</Badge>
                        </TableCell>
                        <TableCell>{item.reorder_point}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(dailySales.totalRevenue))}</div>
              <p className="text-xs text-muted-foreground">Today's revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailySales.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Today's orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStatus.totalItems}</div>
              <p className="text-xs text-muted-foreground">Items in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerInsights.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">Total customers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
