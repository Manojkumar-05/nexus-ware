import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Truck,
  BarChart3,
  UserCheck,
  Settings,
  Database
} from 'lucide-react';
import ChangeOrgDialog from '@/components/ChangeOrgDialog';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchRecentActivities, ActivityItem } from '@/services/activity';
import { useOrg } from '@/contexts/OrgContext';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { organizationName } = useOrg();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Inventory",
      value: "1,234",
      description: "Items in stock",
      icon: Package,
      trend: "+12%"
    },
    {
      title: "Active Orders",
      value: "45",
      description: "Pending orders",
      icon: ShoppingCart,
      trend: "+5%"
    },
    {
      title: "Suppliers",
      value: "28",
      description: "Active suppliers",
      icon: Truck,
      trend: "+2%"
    },
    {
      title: "Total Sales",
      value: "₹10,25,000",
      description: "This month",
      icon: TrendingUp,
      trend: "+18%"
    }
  ];

  const quickActions = [
    {
      title: "Add New Order",
      description: "Create a new order",
      icon: ShoppingCart,
      href: "/orders"
    },
    {
      title: "Add Inventory",
      description: "Add new inventory item",
      icon: Package,
      href: "/inventory"
    },
    {
      title: "Add Supplier",
      description: "Register new supplier",
      icon: Truck,
      href: "/suppliers"
    },
    {
      title: "Generate Report",
      description: "Create sales report",
      icon: BarChart3,
      href: "/reports"
    }
  ];

  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  React.useEffect(() => {
    fetchRecentActivities(8).then(setActivities).catch(() => setActivities([]));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-[pulse_3s_ease-in-out_infinite]">
                {organizationName} • Inventory
              </h1>
            </div>
            <div className="flex items-center space-x-2"></div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <div className="text-xs text-green-600 mt-1">
                    {stat.trend} from last month
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used actions for efficient workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                      onClick={() => navigate(action.href)}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4">
                <ChangeOrgDialog asLink />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and changes in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                )}
                {activities.map((a) => (
                  <div key={`${a.type}-${a.id}`} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Menu */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Modules</CardTitle>
            <CardDescription>
              Navigate to different sections of the inventory management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {[
                { name: "Orders", icon: ShoppingCart, description: "Manage orders", href: "/orders" },
                { name: "Suppliers", icon: Truck, description: "Supplier management", href: "/suppliers" },
                { name: "Inventory", icon: Package, description: "Stock management", href: "/inventory" },
                { name: "Sales", icon: TrendingUp, description: "Sales tracking", href: "/sales" },
                { name: "Reports", icon: BarChart3, description: "Analytics & reports", href: "/reports" },
                { name: "Employees", icon: UserCheck, description: "Staff management", href: "/employees" },
                { name: "Customers", icon: Users, description: "Customer database", href: "/customers" },
                { name: "Audit Logs", icon: Settings, description: "Security & activity logs", href: "/audit" },
                // removed Settings and Data Migration
              ].map((module, index) => {
                const Icon = module.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-gradient-to-br hover:from-muted/50 hover:to-transparent transition-colors"
                    onClick={() => navigate(module.href)}
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">{module.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {module.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;