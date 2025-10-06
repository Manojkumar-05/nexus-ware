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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useOrg } from '@/contexts/OrgContext';
import ChangeOrgDialog from '@/components/ChangeOrgDialog';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '@/hooks/useCustomers';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee as DollarSign,
  ShoppingCart,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Heart,
  MessageSquare
} from 'lucide-react';
import { formatINR, usdToInr } from '@/utils/currency';

const Customers = () => {
  const { user, signOut } = useAuth();
  const { organizationName } = useOrg();
  const navigate = useNavigate();
  const { customers, loading, addCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    tier: 'bronze',
    status: 'active',
    avatar: '',
    tags: [],
    notes: ''
  });

  const handleAddCustomer = async () => {
    await addCustomer(formData);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      tier: 'bronze',
      status: 'active',
      avatar: '',
      tags: [],
      notes: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const mockCustomers = [
    {
      id: "CUST-001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      company: "Tech Solutions Inc",
      status: "active",
      tier: "gold",
      totalOrders: 8,
      totalSpent: 5439.92,
      lastOrder: "2024-01-15",
      firstOrder: "2023-03-10",
      avgOrderValue: 679.99,
      customerSince: "2023-03-10",
      address: "123 Business Ave, City, State 12345",
      notes: "Prefers express shipping, very satisfied with product quality",
      tags: ["VIP", "Tech Enthusiast", "Repeat Customer"],
      avatar: "/avatars/john.jpg"
    },
    {
      id: "CUST-002",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1-555-0456",
      company: "Creative Design Studio",
      status: "active",
      tier: "silver",
      totalOrders: 6,
      totalSpent: 2899.82,
      lastOrder: "2024-01-14",
      firstOrder: "2023-06-15",
      avgOrderValue: 483.30,
      customerSince: "2023-06-15",
      address: "456 Creative Blvd, City, State 12345",
      notes: "Interested in ergonomic office furniture, values design aesthetics",
      tags: ["Design Professional", "Office Setup"],
      avatar: "/avatars/emily.jpg"
    },
    {
      id: "CUST-003",
      name: "Robert Chen",
      email: "robert.chen@email.com",
      phone: "+1-555-0789",
      company: "Global Enterprises",
      status: "active",
      tier: "platinum",
      totalOrders: 12,
      totalSpent: 8799.75,
      lastOrder: "2024-01-13",
      firstOrder: "2022-11-20",
      avgOrderValue: 733.31,
      customerSince: "2022-11-20",
      address: "789 Enterprise Way, City, State 12345",
      notes: "Bulk orders for office, corporate client, excellent payment history",
      tags: ["Corporate", "Bulk Buyer", "VIP"],
      avatar: "/avatars/robert.jpg"
    },
    {
      id: "CUST-004",
      name: "Lisa Brown",
      email: "lisa.brown@email.com",
      phone: "+1-555-0321",
      company: "Freelance Consultant",
      status: "inactive",
      tier: "bronze",
      totalOrders: 4,
      totalSpent: 1649.97,
      lastOrder: "2023-12-15",
      firstOrder: "2023-09-05",
      avgOrderValue: 412.49,
      customerSince: "2023-09-05",
      address: "321 Consultant St, City, State 12345",
      notes: "Small orders, occasional customer, no recent activity",
      tags: ["Freelancer", "Occasional"],
      avatar: "/avatars/lisa.jpg"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      inactive: { color: "bg-gray-100 text-gray-800", icon: Clock },
      suspended: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      prospect: { color: "bg-blue-100 text-blue-800", icon: Clock }
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

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      bronze: { color: "bg-amber-100 text-amber-800", icon: "🥉" },
      silver: { color: "bg-gray-100 text-gray-800", icon: "🥈" },
      gold: { color: "bg-yellow-100 text-yellow-800", icon: "🥇" },
      platinum: { color: "bg-purple-100 text-purple-800", icon: "💎" }
    };
    
    const config = tierConfig[tier as keyof typeof tierConfig];
    
    return (
      <Badge className={config.color}>
        <span className="mr-1">{config.icon}</span>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCustomerLifetime = (customer_since: string) => {
    const start = new Date(customer_since);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(cust => cust.status === 'active').length;
  const totalRevenue = customers.reduce((sum, cust) => sum + cust.total_spent, 0);
  const avgCustomerValue = totalRevenue / totalCustomers;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{organizationName} • Customers</h1>
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
              <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
              <p className="text-muted-foreground">
                Manage customer relationships and track engagement
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter the customer information to add them to your system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Customer full name"
                    className="col-span-3"
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="Company name (optional)"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tier" className="text-right">
                    Customer Tier
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about the customer"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCustomer}>Add Customer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                All registered customers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(totalRevenue))}</div>
              <p className="text-xs text-muted-foreground">
                From all customers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatINR(usdToInr(avgCustomerValue))}</div>
              <p className="text-xs text-muted-foreground">
                Per customer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Tier Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Customer Tier Distribution</CardTitle>
            <CardDescription>
              Breakdown of customers by loyalty tier and their value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {['bronze', 'silver', 'gold', 'platinum'].map(tier => {
                const tierCustomers = customers.filter(cust => cust.tier === tier);
                const count = tierCustomers.length;
                const totalValue = tierCustomers.reduce((sum, cust) => sum + cust.total_spent, 0);
                const percentage = (count / totalCustomers) * 100;
                
                return (
                  <div key={tier} className="text-center">
                    <div className="text-2xl font-bold mb-2">{getTierBadge(tier)}</div>
                    <div className="text-3xl font-bold text-primary mb-1">{count}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {percentage.toFixed(1)}% of total
                    </div>
                    <div className="text-lg font-medium">{formatINR(usdToInr(totalValue))}</div>
                    <div className="text-xs text-muted-foreground">Total value</div>
                  </div>
                );
              })}
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
                    placeholder="Search customers by name, email, or company..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>
              Complete list of all customers with their details and purchase history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Orders & Spending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer Since</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.company || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTierBadge(customer.tier)}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Orders:</span>
                          <span className="font-medium">{customer.total_orders}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total:</span>
                          <span className="font-medium">{formatINR(usdToInr(customer.total_spent))}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg:</span>
                          <span className="text-sm text-muted-foreground">{formatINR(usdToInr(customer.avg_order_value))}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.customer_since}</div>
                      <div className="text-xs text-muted-foreground">
                        {getCustomerLifetime(customer.customer_since)} days
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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

        {/* Customer Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Key metrics and analysis of your customer base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Top Customers by Value</h4>
                <div className="space-y-3">
                  {customers
                    .sort((a, b) => b.total_spent - a.total_spent)
                    .slice(0, 3)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{customer.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatINR(usdToInr(customer.total_spent))}</div>
                          <div className="text-xs text-muted-foreground">{customer.total_orders} orders</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Customer Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recent (30 days)</span>
                    <Badge variant="secondary">
                      {customers.filter(cust => {
                        const last_order = new Date(cust.last_order);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return last_order > thirtyDaysAgo;
                      }).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active (90 days)</span>
                    <Badge variant="secondary">
                      {customers.filter(cust => {
                        const last_order = new Date(cust.last_order);
                        const ninetyDaysAgo = new Date();
                        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                        return last_order > ninetyDaysAgo;
                      }).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inactive (&gt;90 days)</span>
                    <Badge variant="secondary">
                      {customers.filter(cust => {
                        const last_order = new Date(cust.last_order);
                        const ninetyDaysAgo = new Date();
                        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                        return last_order <= ninetyDaysAgo;
                      }).length}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Customer Engagement</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Engagement</span>
                      <span className="text-sm font-medium">
                        {customers.filter(cust => cust.total_orders >= 8).length}
                      </span>
                    </div>
                    <Progress 
                      value={(customers.filter(cust => cust.total_orders >= 8).length / customers.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Engagement</span>
                      <span className="text-sm font-medium">
                        {customers.filter(cust => cust.total_orders >= 4 && cust.total_orders < 8).length}
                      </span>
                    </div>
                    <Progress 
                      value={(customers.filter(cust => cust.total_orders >= 4 && cust.total_orders < 8).length / customers.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Engagement</span>
                      <span className="text-sm font-medium">
                        {customers.filter(cust => cust.total_orders < 4).length}
                      </span>
                    </div>
                    <Progress 
                      value={(customers.filter(cust => cust.total_orders < 4).length / customers.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customers;
