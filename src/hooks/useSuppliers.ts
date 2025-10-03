import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: string;
  rating: number;
  total_orders: number;
  total_spent: number;
  last_order: string;
  reliability: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
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
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_orders' | 'total_spent' | 'last_order' | 'reliability'>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          ...supplier,
          rating: 0,
          total_orders: 0,
          total_spent: 0,
          last_order: new Date().toISOString().split('T')[0],
          reliability: 'good'
        } as any)
        .select()
        .single();

      if (error) throw error;

      setSuppliers([data, ...suppliers]);
      toast({
        title: "Success",
        description: "Supplier added successfully"
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

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSuppliers(suppliers.map(supplier => supplier.id === id ? data : supplier));
      toast({
        title: "Success",
        description: "Supplier updated successfully"
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

  const deleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      toast({
        title: "Success",
        description: "Supplier deleted successfully"
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
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers
  };
};
