-- Enable RLS on all tables that are missing it
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for authenticated users
CREATE POLICY "Users can view all customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage customers"
  ON public.customers FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage employees"
  ON public.employees FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all inventory"
  ON public.inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage inventory"
  ON public.inventory FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage reports"
  ON public.reports FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all sales"
  ON public.sales FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage sales"
  ON public.sales FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all settings"
  ON public.settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage settings"
  ON public.settings FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all suppliers"
  ON public.suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage suppliers"
  ON public.suppliers FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.generate_employee_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN 'EMP-' || LPAD(NEXTVAL('employee_sequence')::TEXT, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_sale_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN 'SAL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('sale_sequence')::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;