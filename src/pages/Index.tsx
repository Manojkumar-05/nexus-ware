import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dynamic Stock & Inventory Management System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your business operations with our comprehensive inventory management solution. 
              Track orders, manage suppliers, monitor sales, and generate insightful reports all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need to manage your inventory efficiently</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: ShoppingCart,
              title: "Order Management",
              description: "Create, track, and manage orders with real-time status updates and automated workflows."
            },
            {
              icon: Users,
              title: "Supplier Management",
              description: "Maintain comprehensive supplier databases with contact information and performance metrics."
            },
            {
              icon: Package,
              title: "Inventory Tracking",
              description: "Monitor stock levels, track item locations, and receive low-stock alerts automatically."
            },
            {
              icon: TrendingUp,
              title: "Sales Analytics",
              description: "Generate detailed sales reports and analytics to make data-driven business decisions."
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Enterprise-grade security with role-based access control and data encryption."
            },
            {
              icon: Zap,
              title: "Fast & Efficient",
              description: "Optimized performance with real-time updates and responsive user interface."
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses that trust our inventory management system
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
            Start Your Free Trial
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Dynamic Stock & Inventory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
