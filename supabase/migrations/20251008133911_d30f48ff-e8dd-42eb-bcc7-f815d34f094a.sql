-- Add expiry_date column to inventory table
ALTER TABLE public.inventory 
ADD COLUMN expiry_date DATE;