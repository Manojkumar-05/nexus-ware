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
import { useSales } from '@/hooks/useSales';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  IndianRupee as DollarSign,
  ShoppingCart,
  User,
  Calendar,
  Package,
  BarChart3,
  Target,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { formatINR, usdToInr } from '@/utils/currency';

const Sales = () => {
  const { user, signOut } = useAuth();
  const { organizationName } = useOrg();
  const navigate = useNavigate();
  const { sales, loading, addSale, deleteSale } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    customer_email: '',
    customer_phone: '',
    items: [],
    total: 0,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    payment_method: 'Credit Card',
    salesperson: '',
    location: '',
    notes: ''
  });

  const handleAddSale = async () => {
    await addSale(formData);
    setIsDialogOpen(false);
    setFormData({
      customer: '',
      customer_email: '',
      customer_phone: '',
      items: [],
      total: 0,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      payment_method: 'Credit Card',
      salesperson: '',
      location: '',
      notes: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      await deleteSale(id);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const mockSales = [
    {
      id: "SALE-001",
      customer: "John Smith",
      customerEmail: "john.smith@email.com",
      customerPhone: "+1-555-0123",
      items: [
        { name: "Laptop Dell XPS 13", quantity: 1, price: 1299.99 },
        { name: "Wireless Mouse Logitech MX Master", quantity: 1, price: 79.99 }
      ],
      total: 1379.98,
      status: "completed",
      date: "2024-01-15",
      time: "14:30",
      paymentMethod: "Credit Card",
      salesperson: "Sarah Johnson",
      location: "Online Store",
      notes: "Customer requested express shipping"
    },
    {
      id: "SALE-002",
      customer: "Emily Davis",
      customerEmail: "emily.davis@email.com",
      customerPhone: "+1-555-0456",
      items: [
        { name: "LED Desk Lamp", quantity: 2, price: 49.99 },
        { name: "Steel Office Chair", quantity: 1, price: 299.99 }
      ],
      total: 399.97,
      status: "processing",
      date: "2024-01-14",
      time: "11:15",
      paymentMethod: "PayPal",
      salesperson: "Mike Wilson",
      location: "Store Front",
      notes: "Customer will pick up in store"
    },
    {
      id: "SALE-003",
      customer: "Robert Chen",
      customerEmail: "robert.chen@email.com",
      customerPhone: "+1-555-0789",
      items: [
        { name: "Wireless Mouse Logitech MX Master", quantity: 3, price: 79.99 }
      ],
      total: 239.97,
      status: "shipped",
      date: "2024-01-13",
      time: "16:45",
      paymentMethod: "Credit Card",
      salesperson: "Sarah Johnson",
      location: "Online Store",
      notes: "Bulk order for office use"
    },
    {
      id: "SALE-004",
      customer: "Lisa Brown",
      customerEmail: "lisa.brown@email.com",
      customerPhone: "+1-555-0321",
      items: [
        { name: "Laptop Dell XPS 13", quantity: 1, price: 1299.99 },
        { name: "LED Desk Lamp", quantity: 1, price: 49.99 },
        { name: "Steel Office Chair", quantity: 1, price: 299.99 }
      ],
      total: 1649.97,
      status: "pending",
      date: "2024-01-12",
      time: "09:20",
      paymentMethod: "Bank Transfer",
      salesperson: "Mike Wilson",
      location: "Store Front",
      notes: "Waiting for payment confirmation"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      processing: { color: "bg-blue-100 text-blue-800", icon: Clock },
      shipped: { color: "bg-purple-100 text-purple-800", icon: Package },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      cancelled: { color: "bg-red-100 text-red-800", icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodConfig = {
      'Credit Card': { icon: DollarSign, color: "text-blue-600" },
      'PayPal': { icon: DollarSign, color: "text-blue-500" },
      'Bank Transfer': { icon: DollarSign, color: "text-green-600" },
      'Cash': { icon: DollarSign, color: "text-green-600" }
    };
    
    const config = methodConfig[method as keyof typeof methodConfig];
    const Icon = config.icon;
    
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const matchesDate = dateFilter === 'all' || sale.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = sales.filter(sale => sale.status === 'completed').length;
  const pendingSales = sales.filter(sale => sale.status === 'pending').length;
  const averageOrderValue = totalRevenue / sales.length;

  // Calculate monthly trends (mock data)
  const monthlyData = [
    { month: 'Jan', revenue: 45000, orders: 45 },
    { month: 'Feb', revenue: 52000, orders: 52 },
    { month: 'Mar', revenue: 48000, orders: 48 },
    { month: 'Apr', revenue: 61000, orders: 61 },
    { month: 'May', revenue: 55000, orders: 55 },
    { month: 'Jun', revenue: 67000, orders: 67 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{organizationName} • Sales</h1>
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
              <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
              <p className="text-muted-foreground">
                Track sales performance and customer transactions
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Create New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Sale</DialogTitle>
                <DialogDescription>
                  Record a new customer sale transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Input
                    id="customer"
                    placeholder="Customer name"
                    className="col-span-3"
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@email.com"
                    className="col-span-3"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1-555-0123"
                    className="col-span-3"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="col-span-3"
                    value={formData.total}
                    onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment" className="text-right">
                    Payment Method
                  </Label>
                  <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSale}>Create Sale</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(totalRevenue))}</div>
              <p className="text-xs text-muted-foreground">
                All time sales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales.length}</div>
              <p className="text-xs text-muted-foreground">
                Transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSales}</div>
              <p className="text-xs text-muted-foreground">
                Successful transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(averageOrderValue))}</div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>
              Revenue and order count over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="text-center">
                  <div className="text-sm font-medium mb-2">{data.month}</div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {formatINR(usdToInr(data.revenue))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data.orders} orders
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sales by customer, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {Array.from(new Set(sales.map(sale => sale.date))).map(date => (
                    <SelectItem key={date} value={date}>{date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Transactions</CardTitle>
            <CardDescription>
              Complete list of all sales with customer details and items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Salesperson</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sale.customer}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {sale.customer_email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {sale.customer_phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {sale.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatINR(usdToInr(sale.total))}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(sale.payment_method)}
                        <span className="text-sm">{sale.payment_method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{sale.salesperson}</div>
                      <div className="text-xs text-muted-foreground">{sale.location}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{sale.date}</div>
                      <div className="text-xs text-muted-foreground">{sale.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(sale.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales Analytics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>
              Key insights and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Top Performing Salespeople</h4>
                <div className="space-y-3">
                  {Array.from(new Set(sales.map(sale => sale.salesperson))).map(salesperson => {
                    const salesCount = sales.filter(sale => sale.salesperson === salesperson).length;
                    const totalRevenue = sales.filter(sale => sale.salesperson === salesperson)
                      .reduce((sum, sale) => sum + sale.total, 0);
                    return (
                      <div key={salesperson} className="flex items-center justify-between">
                        <span className="text-sm">{salesperson}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{salesCount} sales</div>
                          <div className="text-xs text-muted-foreground">{formatINR(usdToInr(totalRevenue))}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Payment Method Distribution</h4>
                <div className="space-y-3">
                  {Array.from(new Set(sales.map(sale => sale.payment_method))).map(method => {
                    const count = sales.filter(sale => sale.payment_method === method).length;
                    const percentage = (count / sales.length) * 100;
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-sm">{method}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{count}</div>
                          <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Sales by Location</h4>
                <div className="space-y-3">
                  {Array.from(new Set(sales.map(sale => sale.location))).map(location => {
                    const count = sales.filter(sale => sale.location === location).length;
                    const totalRevenue = sales.filter(sale => sale.location === location)
                      .reduce((sum, sale) => sum + sale.total, 0);
                    return (
                      <div key={location} className="flex items-center justify-between">
                        <span className="text-sm">{location}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{count} sales</div>
                          <div className="text-xs text-muted-foreground">{formatINR(usdToInr(totalRevenue))}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mock CreditCard icon component
const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export default Sales;
