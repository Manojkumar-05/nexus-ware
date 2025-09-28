import { supabase } from '@/integrations/supabase/client';

export type ActivityItem = {
  id: string;
  type: 'order' | 'inventory' | 'supplier' | 'sale' | 'employee' | 'customer' | 'report';
  title: string;
  timestamp: string;
};

export async function fetchRecentActivities(limit = 10): Promise<ActivityItem[]> {
  const items: ActivityItem[] = [];

  // Fetch most recent rows across key tables, then merge and sort
  const queries = [
    supabase.from('orders').select('id, date').order('date', { ascending: false }).limit(limit),
    supabase.from('inventory').select('id, last_updated').order('last_updated', { ascending: false }).limit(limit),
    supabase.from('suppliers').select('id, last_order').order('last_order', { ascending: false }).limit(limit),
    supabase.from('sales').select('id, date, time').order('date', { ascending: false }).limit(limit)
  ];

  const results = await Promise.allSettled(queries);

  // Orders
  const ordersRes = results[0].status === 'fulfilled' ? results[0].value : null;
  if (ordersRes && !ordersRes.error && ordersRes.data) {
    for (const row of ordersRes.data as any[]) {
      items.push({ id: row.id, type: 'order', title: `Order ${row.id} placed`, timestamp: row.date });
    }
  }

  // Inventory
  const invRes = results[1].status === 'fulfilled' ? results[1].value : null;
  if (invRes && !invRes.error && invRes.data) {
    for (const row of invRes.data as any[]) {
      items.push({ id: row.id, type: 'inventory', title: `Inventory updated for ${row.id}`, timestamp: row.last_updated });
    }
  }

  // Suppliers
  const supRes = results[2].status === 'fulfilled' ? results[2].value : null;
  if (supRes && !supRes.error && supRes.data) {
    for (const row of supRes.data as any[]) {
      items.push({ id: row.id, type: 'supplier', title: `Supplier activity ${row.id}`, timestamp: row.last_order });
    }
  }

  // Sales
  const salesRes = results[3].status === 'fulfilled' ? results[3].value : null;
  if (salesRes && !salesRes.error && salesRes.data) {
    for (const row of salesRes.data as any[]) {
      const ts = `${row.date} ${row.time ?? ''}`.trim();
      items.push({ id: row.id, type: 'sale', title: `Sale ${row.id} recorded`, timestamp: ts });
    }
  }

  // Sort by time desc and return top limit
  return items
    .filter(a => !!a.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}



