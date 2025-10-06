import { supabase } from '@/integrations/supabase/client';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT' | 'VIEW';
export type EntityType = 'order' | 'inventory' | 'supplier' | 'employee' | 'customer' | 'report' | 'sale' | 'user';
export type Severity = 'low' | 'medium' | 'high';

interface LogAuditParams {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
  severity?: Severity;
}

export async function logAudit({
  action,
  entityType,
  entityId,
  details,
  severity = 'low'
}: LogAuditParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      user_email: user?.email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
      severity
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}
