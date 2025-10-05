import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
  hire_date: string;
  salary: number;
  status: string;
  address: string;
  avatar: string;
  performance: number;
  skills: string[];
  achievements: string[];
  direct_reports: number;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false});

      if (error) throw error;
      setEmployees(data || []);
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
    fetchEmployees();
  }, []);

  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'performance' | 'direct_reports'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          id: crypto.randomUUID(),
          ...employee,
          performance: 0,
          direct_reports: 0
        } as any)
        .select()
        .single();

      if (error) throw error;

      setEmployees([data, ...employees]);
      toast({
        title: "Success",
        description: "Employee added successfully"
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

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEmployees(employees.map(employee => employee.id === id ? data : employee));
      toast({
        title: "Success",
        description: "Employee updated successfully"
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

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmployees(employees.filter(employee => employee.id !== id));
      toast({
        title: "Success",
        description: "Employee deleted successfully"
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
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees
  };
};
