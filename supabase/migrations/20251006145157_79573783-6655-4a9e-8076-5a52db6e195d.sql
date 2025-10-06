-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  severity text DEFAULT 'low',
  CHECK (severity IN ('low', 'medium', 'high'))
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);