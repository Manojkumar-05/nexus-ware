import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  quantity: number;
  min_quantity: number;
  max_quantity: number;
  unit_price: number;
  supplier: string;
  location: string;
  status: string;
  last_updated: string;
  reorder_point: number;
  total_value: number;
  expiry_date?: string | null;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
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
    fetchInventory();
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'total_value' | 'last_updated' | 'expiry_date'> & { expiry_date?: string | null }) => {
    try {
      const total_value = item.quantity * item.unit_price;
      const { data, error } = await supabase
        .from('inventory')
        .insert({ 
          id: crypto.randomUUID(),
          ...item, 
          total_value, 
          last_updated: new Date().toISOString().split('T')[0] 
        } as any)
        .select()
        .single();

      if (error) throw error;

      setInventory([data, ...inventory]);
      toast({
        title: "Success",
        description: "Item added successfully"
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

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updatedData: any = { ...updates };
      if (updates.quantity !== undefined || updates.unit_price !== undefined) {
        const item = inventory.find(i => i.id === id);
        if (item) {
          updatedData.total_value = (updates.quantity ?? item.quantity) * (updates.unit_price ?? item.unit_price);
        }
      }
      
      const { data, error } = await supabase
        .from('inventory')
        .update({ ...updatedData, last_updated: new Date().toISOString().split('T')[0] })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInventory(inventory.map(item => item.id === id ? data : item));
      toast({
        title: "Success",
        description: "Item updated successfully"
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

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInventory(inventory.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Item deleted successfully"
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

  const addStock = async (id: string, quantity: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return { error: 'Item not found' };

    const newQuantity = item.quantity + quantity;
    return await updateItem(id, { quantity: newQuantity });
  };

  return {
    inventory,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addStock,
    refetch: fetchInventory
  };
};
