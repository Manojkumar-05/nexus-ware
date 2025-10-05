import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Sale {
  id: string;
  customer: string;
  customer_email: string;
  customer_phone: string;
  items: any;
  total: number;
  status: string;
  date: string;
  time: string;
  payment_method: string;
  salesperson: string;
  location: string;
  notes: string;
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
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
    fetchSales();
  }, []);

  const addSale = async (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          id: crypto.randomUUID(),
          ...sale
        } as any)
        .select()
        .single();

      if (error) throw error;

      setSales([data, ...sales]);
      toast({
        title: "Success",
        description: "Sale created successfully"
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSales(sales.map(sale => sale.id === id ? data : sale));
      toast({
        title: "Success",
        description: "Sale updated successfully"
      });
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSales(sales.filter(sale => sale.id !== id));
      toast({
        title: "Success",
        description: "Sale deleted successfully"
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    sales,
    loading,
    addSale,
    updateSale,
    deleteSale,
    refetch: fetchSales
  };
};
