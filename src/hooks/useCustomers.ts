import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logAudit } from '@/services/auditLog';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: string;
  avatar: string;
  tier: string;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  customer_since: string;
  first_order: string;
  last_order: string;
  tags: string[];
  notes: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
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
    fetchCustomers();
  }, []);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_spent' | 'avg_order_value' | 'customer_since' | 'first_order' | 'last_order'>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('customers')
        .insert({
          id: crypto.randomUUID(),
          ...customer,
          total_orders: 0,
          total_spent: 0,
          avg_order_value: 0,
          customer_since: today,
          first_order: today,
          last_order: today
        } as any)
        .select()
        .single();

      if (error) throw error;

      setCustomers([data, ...customers]);
      toast({
        title: "Success",
        description: "Customer added successfully"
      });
      
      await logAudit({
        action: 'CREATE',
        entityType: 'customer',
        entityId: data.id,
        details: { name: data.name, company: data.company },
        severity: 'low'
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

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCustomers(customers.map(customer => customer.id === id ? data : customer));
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      
      await logAudit({
        action: 'UPDATE',
        entityType: 'customer',
        entityId: id,
        details: updates,
        severity: 'low'
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

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomers(customers.filter(customer => customer.id !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
      
      await logAudit({
        action: 'DELETE',
        entityType: 'customer',
        entityId: id,
        severity: 'medium'
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
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
};
