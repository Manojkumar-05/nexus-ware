import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  created_at: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  severity: 'low' | 'medium' | 'high';
}

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs((data || []) as AuditLog[]);
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('audit_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_logs'
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    logs,
    loading,
    refetch: fetchLogs
  };
};
