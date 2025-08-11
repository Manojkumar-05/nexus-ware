import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Truck,
  BarChart3,
  UserCheck,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

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
      value: "$12,345",
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
      href: "/orders/new"
    },
    {
      title: "Add Inventory",
      description: "Add new inventory item",
      icon: Package,
      href: "/inventory/new"
    },
    {
      title: "Add Supplier",
      description: "Register new supplier",
      icon: Truck,
      href: "/suppliers/new"
    },
    {
      title: "Generate Report",
      description: "Create sales report",
      icon: BarChart3,
      href: "/reports"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Inventory Management</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
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
                      className="h-auto p-4 flex flex-col items-center space-y-2"
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
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New order #1234 created</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Inventory updated for Product A</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New supplier registered</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Orders", icon: ShoppingCart, description: "Manage orders" },
                { name: "Suppliers", icon: Truck, description: "Supplier management" },
                { name: "Inventory", icon: Package, description: "Stock management" },
                { name: "Sales", icon: TrendingUp, description: "Sales tracking" },
                { name: "Reports", icon: BarChart3, description: "Analytics & reports" },
                { name: "Employees", icon: UserCheck, description: "Staff management" },
                { name: "Customers", icon: Users, description: "Customer database" },
                { name: "Settings", icon: Settings, description: "System settings" }
              ].map((module, index) => {
                const Icon = module.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
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