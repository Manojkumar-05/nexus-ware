import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useReports = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      // Fetch sales data
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Fetch inventory data
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('*');

      if (inventoryError) throw inventoryError;

      // Fetch customer data
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) throw customersError;

      setSalesData(sales || []);
      setInventoryData(inventory || []);
      setCustomerData(customers || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const generateDailySalesSummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = salesData.filter(sale => sale.date === today);
    
    const totalRevenue = todaySales.reduce((sum, sale) => sum + Number(sale.total), 0);
    const totalTransactions = todaySales.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      date: today,
      totalRevenue,
      totalTransactions,
      avgTransaction,
      sales: todaySales
    };
  };

  const generateInventoryStatus = () => {
    const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const lowStockItems = inventoryData.filter(item => item.quantity <= item.reorder_point);
    const outOfStockItems = inventoryData.filter(item => item.quantity === 0);

    return {
      totalItems,
      totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockItems,
      outOfStockItems,
      inventory: inventoryData
    };
  };

  const generateCustomerInsights = () => {
    const totalCustomers = customerData.length;
    const activeCustomers = customerData.filter(c => c.status === 'active').length;
    const topCustomers = [...customerData]
      .sort((a, b) => Number(b.total_spent) - Number(a.total_spent))
      .slice(0, 10);
    
    const avgSpending = customerData.length > 0 
      ? customerData.reduce((sum, c) => sum + Number(c.total_spent), 0) / customerData.length 
      : 0;

    const tierDistribution = customerData.reduce((acc: any, c) => {
      acc[c.tier] = (acc[c.tier] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCustomers,
      activeCustomers,
      avgSpending,
      topCustomers,
      tierDistribution,
      customers: customerData
    };
  };

  return {
    loading,
    salesData,
    inventoryData,
    customerData,
    generateDailySalesSummary,
    generateInventoryStatus,
    generateCustomerInsights,
    refetch: fetchReportData
  };
};
